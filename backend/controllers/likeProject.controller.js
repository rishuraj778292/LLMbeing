import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import LikedProject from "../models/likedProject.model.js";
import DislikedProject from "../models/dislikedProject.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";

// get user liked projects
const getUserLikedProjects = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    if (!userId) throw new ApiError(400, "User ID not found");

    // Only freelancers can like projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can access liked projects");
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    try {
        // Get user's liked projects
        const likedProjects = await LikedProject.find({ user: userId })
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
        const validProjects = likedProjects.filter(item => item.project !== null);

        // Get total count for pagination
        const totalCount = await LikedProject.countDocuments({ user: userId });

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
                "Liked projects retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve liked projects: " + error.message);
    }
});

// toggle like/unlike project
const toggleLikeProject = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    if (!userId) throw new ApiError(400, "User ID not found");
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Only freelancers can like projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can like projects");
    }

    try {
        // Check if project exists and is active
        const project = await Project.findById(projectId);
        if (!project || !project.isActive) {
            throw new ApiError(404, "Project not found or inactive");
        }

        // Check if user has disliked this project - remove dislike if exists
        const existingDislike = await DislikedProject.findOne({
            user: userId,
            project: projectId
        });

        if (existingDislike) {
            await existingDislike.deleteOne();
        }

        // Use the toggle method from LikedProject model
        const result = await LikedProject.toggleLike(userId, projectId);

        return res.status(200).json(
            new ApiResponse(200, result, result.message)
        );
    } catch (error) {
        if (error.message.includes('already liked')) {
            throw new ApiError(400, error.message);
        }
        throw new ApiError(500, "Failed to toggle like status: " + error.message);
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

// get project likers
const getProjectLikers = asyncHandler(async (req, res) => {
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

        // Get project likers using static method
        const likers = await LikedProject.getProjectLikers(projectId, { page, limit });

        // Get total count
        const totalCount = await LikedProject.countDocuments({ project: projectId });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    likers,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalCount,
                        hasNext: page < Math.ceil(totalCount / limit),
                        hasPrev: page > 1
                    }
                },
                "Project likers retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve project likers: " + error.message);
    }
});

// delete specific liked project
const deleteLikedProject = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    if (!userId) throw new ApiError(400, "User ID not found");
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Only freelancers can manage liked projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can manage liked projects");
    }

    try {
        const likedProject = await LikedProject.findOne({
            user: userId,
            project: projectId
        });

        if (!likedProject) {
            throw new ApiError(404, "Liked project not found");
        }

        await likedProject.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, null, "Project removed from liked list successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to remove liked project: " + error.message);
    }
});

// delete all user liked projects
const deleteAllLikedProjects = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    if (!userId) throw new ApiError(400, "User ID not found");

    // Only freelancers can manage liked projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can manage liked projects");
    }

    try {
        const result = await LikedProject.deleteMany({ user: userId });

        // Also update user's likedProjects array
        await User.findByIdAndUpdate(userId, {
            $set: { likedProjects: [] }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount: result.deletedCount },
                `${result.deletedCount} liked projects removed successfully`
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to remove all liked projects: " + error.message);
    }
});

// get user's like/dislike status for a project
const getProjectLikeStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    if (!userId) throw new ApiError(400, "User ID not found");
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Only freelancers can check like status
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can check project like status");
    }

    try {
        const [liked, disliked] = await Promise.all([
            LikedProject.findOne({ user: userId, project: projectId }),
            DislikedProject.findOne({ user: userId, project: projectId })
        ]);

        const status = {
            isLiked: !!liked,
            isDisliked: !!disliked,
            likedAt: liked?.createdAt || null,
            dislikedAt: disliked?.createdAt || null
        };

        return res.status(200).json(
            new ApiResponse(200, status, "Project like status retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to get project like status: " + error.message);
    }
});

export {
    getUserLikedProjects,
    toggleLikeProject,
    toggleDislikeProject,
    getProjectLikers,
    deleteLikedProject,
    deleteAllLikedProjects,
    getProjectLikeStatus
};