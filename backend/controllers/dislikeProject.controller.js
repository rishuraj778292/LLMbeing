import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import DislikedProject from "../models/dislikedProject.model.js";
import LikedProject from "../models/likedProject.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";

// get user disliked projects
const getUserDislikedProjects = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    if (!userId) throw new ApiError(400, "User ID not found");

    // Only freelancers can dislike projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can access disliked projects");
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    try {
        // Get user's disliked projects
        const dislikedProjects = await DislikedProject.find({ user: userId })
            .populate({
                path: 'project',
                match: { isActive: true },
                populate: {
                    path: 'client',
                    select: 'userName fullName profileImage averageRating'
                }
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        // Filter out projects that might be null (inactive projects)
        const validProjects = dislikedProjects.filter(item => item.project !== null);

        // Get total count for pagination
        const totalCount = await DislikedProject.countDocuments({ user: userId });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    projects: validProjects,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalCount,
                        hasNext: page < Math.ceil(totalCount / limit),
                        hasPrev: page > 1
                    }
                },
                "Disliked projects retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve disliked projects: " + error.message);
    }
});

// toggle dislike/undislike project
const toggleDislikeProject = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    if (!userId) throw new ApiError(400, "User ID not found");
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Only freelancers can dislike projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can dislike projects");
    }

    try {
        // Check if project exists and is active
        const project = await Project.findById(projectId);
        if (!project || !project.isActive) {
            throw new ApiError(404, "Project not found or inactive");
        }

        // Check if user has liked this project - remove like if exists
        const existingLike = await LikedProject.findOne({
            user: userId,
            project: projectId
        });

        if (existingLike) {
            await existingLike.deleteOne();
        }

        // Use the toggle method from DislikedProject model
        const result = await DislikedProject.toggleDislike(userId, projectId);

        return res.status(200).json(
            new ApiResponse(200, result, result.message)
        );
    } catch (error) {
        if (error.message.includes('already disliked')) {
            throw new ApiError(400, error.message);
        }
        throw new ApiError(500, "Failed to toggle dislike status: " + error.message);
    }
});

// get project dislikers
const getProjectDislikers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    if (!projectId) throw new ApiError(400, "Project ID is required");

    try {
        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        // Get project dislikers using static method
        const dislikers = await DislikedProject.getProjectDislikers(projectId, { page, limit });

        // Get total count
        const totalCount = await DislikedProject.countDocuments({ project: projectId });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    dislikers,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalCount,
                        hasNext: page < Math.ceil(totalCount / limit),
                        hasPrev: page > 1
                    }
                },
                "Project dislikers retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve project dislikers: " + error.message);
    }
});

// delete specific disliked project
const deleteDislikedProject = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    if (!userId) throw new ApiError(400, "User ID not found");
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Only freelancers can manage disliked projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can manage disliked projects");
    }

    try {
        const dislikedProject = await DislikedProject.findOne({
            user: userId,
            project: projectId
        });

        if (!dislikedProject) {
            throw new ApiError(404, "Disliked project not found");
        }

        await dislikedProject.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, null, "Project removed from disliked list successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to remove disliked project: " + error.message);
    }
});

// delete all user disliked projects
const deleteAllDislikedProjects = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    if (!userId) throw new ApiError(400, "User ID not found");

    // Only freelancers can manage disliked projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can manage disliked projects");
    }

    try {
        const result = await DislikedProject.deleteMany({ user: userId });

        // Also update user's dislikedProjects array
        await User.findByIdAndUpdate(userId, {
            $set: { dislikedProjects: [] }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount: result.deletedCount },
                `${result.deletedCount} disliked projects removed successfully`
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to remove all disliked projects: " + error.message);
    }
});

// get user's dislike status for a project
const getProjectDislikeStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    if (!userId) throw new ApiError(400, "User ID not found");
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Only freelancers can check dislike status
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can check project dislike status");
    }

    try {
        const disliked = await DislikedProject.findOne({
            user: userId,
            project: projectId
        });

        const status = {
            isDisliked: !!disliked,
            dislikedAt: disliked?.createdAt || null
        };

        return res.status(200).json(
            new ApiResponse(200, status, "Project dislike status retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to get project dislike status: " + error.message);
    }
});

// get top disliked projects (admin/analytics purpose)
const getTopDislikedProjects = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        // Get projects with highest dislike counts
        const projects = await Project.find({
            isActive: true,
            'stats.dislikeCount': { $gt: 0 }
        })
            .populate('client', 'userName fullName profileImage')
            .sort({ 'stats.dislikeCount': -1, createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const totalCount = await Project.countDocuments({
            isActive: true,
            'stats.dislikeCount': { $gt: 0 }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    projects,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalCount,
                        hasNext: page < Math.ceil(totalCount / limit),
                        hasPrev: page > 1
                    }
                },
                "Top disliked projects retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve top disliked projects: " + error.message);
    }
});

export {
    getUserDislikedProjects,
    toggleDislikeProject,
    getProjectDislikers,
    deleteDislikedProject,
    deleteAllDislikedProjects,
    getProjectDislikeStatus,
    getTopDislikedProjects
};