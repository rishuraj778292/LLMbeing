import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import SavedProject from "../models/savedProject.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";


// get user saved projects
const getUserSavedProjects = asyncHandler(async (req, res) => {
    
    const userId = req.user._id;
    if (!userId) throw new ApiError(400, "User ID not found");

    // Only freelancers can save projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can access saved projects");
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    try {
        // Use the static method from SavedProject model
        const savedProjects = await SavedProject.getUserSavedProjects(userId, { page, limit });

        // Filter out projects that might be null (inactive projects)
        const validProjects = savedProjects.filter(item => item.project !== null);

        // Get total count for pagination
        const totalCount = await SavedProject.countDocuments({ user: userId });

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
                "Saved projects retrieved successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve saved projects: " + error.message);
    }
});

// toggle save/unsave project
const toggleSaveProject = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { projectId } = req.params;

    if (!userId) throw new ApiError(400, "User ID not found");
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Only freelancers can save projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can save projects");
    }

    try {
        // Check if project exists and is active
        const project = await Project.findById(projectId);
        if (!project || !project.isActive) {
            throw new ApiError(404, "Project not found or inactive");
        }

        // Use the toggle method from SavedProject model
        const result = await SavedProject.toggleSave(userId, projectId);

        return res.status(200).json(
            new ApiResponse(200, result, result.message)
        );
    } catch (error) {
        if (error.message.includes('already saved')) {
            throw new ApiError(400, error.message);
        }
        throw new ApiError(500, "Failed to toggle save status: " + error.message);
    }
});

// delete specific saved project
const deleteSavedProject = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { projectId } = req.params;

    if (!userId) throw new ApiError(400, "User ID not found");
    if (!projectId) throw new ApiError(400, "Project ID is required");

    // Only freelancers can manage saved projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can manage saved projects");
    }

    try {
        const savedProject = await SavedProject.findOne({
            user: userId,
            project: projectId
        });

        if (!savedProject) {
            throw new ApiError(404, "Saved project not found");
        }

        await savedProject.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, null, "Project removed from saved list successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to remove saved project: " + error.message);
    }
});

// delete all user saved projects
const deleteAllSavedProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) throw new ApiError(400, "User ID not found");

    // Only freelancers can manage saved projects
    if (req.user.role !== 'freelancer') {
        throw new ApiError(403, "Only freelancers can manage saved projects");
    }

    try {
        const result = await SavedProject.deleteMany({ user: userId });

        // Also update user's savedProjects array
        await User.findByIdAndUpdate(userId, {
            $set: { savedProjects: [] }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                { deletedCount: result.deletedCount },
                `${result.deletedCount} saved projects removed successfully`
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to remove all saved projects: " + error.message);
    }
});

export {
    getUserSavedProjects,
    toggleSaveProject,
    deleteSavedProject,
    deleteAllSavedProjects
};