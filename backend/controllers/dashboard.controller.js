import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Application from "../models/application.model.js";
import Project from "../models/project.model.js";
import Gig from "../models/gig.model.js";
import User from "../models/user.model.js";
import SavedProject from "../models/savedProject.model.js";
import LikedProject from "../models/likedProject.model.js";
import DislikedProject from "../models/dislikedProject.model.js";

// get role-based dashboard data
const getDashboardData = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!userId) throw new ApiError(400, "User ID not found");

    try {
        let dashboardData = {};

        if (userRole === 'freelancer') {
            dashboardData = await getFreelancerDashboard(userId);
        } else if (userRole === 'client') {
            dashboardData = await getClientDashboard(userId);
        } else {
            throw new ApiError(403, "Invalid user role for dashboard access");
        }

        return res.status(200).json(
            new ApiResponse(200, dashboardData, "Dashboard data retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve dashboard data: " + error.message);
    }
});

// freelancer dashboard data
const getFreelancerDashboard = async (userId) => {
    // Get application statistics
    const applicationStats = await Application.aggregate([
        { $match: { freelancer: userId } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const stats = applicationStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
    }, {
        pending: 0,
        interviewing: 0,
        accepted: 0,
        rejected: 0,
        withdrawn: 0,
        submitted: 0,
        completed: 0
    });

    // Get recent projects (active projects to apply)
    const recentProjects = await Project.find({
        isActive: true,
        projectStatus: 'active'
    })
        .populate('client', 'userName fullName profileImage averageRating')
        .sort({ createdAt: -1 })
        .limit(6)
        .select('title description budget skillsRequired createdAt deadline projectCategory');

    // Get ongoing/active applications (accepted status)
    const ongoingApplications = await Application.find({
        freelancer: userId,
        status: 'accepted'
    })
        .populate('project', 'title budget client projectStatus deadline')
        .populate('project.client', 'userName fullName profileImage')
        .sort({ acceptedAt: -1 })
        .limit(5);

    // Get completed applications
    const completedApplications = await Application.find({
        freelancer: userId,
        status: 'completed'
    })
        .populate('project', 'title budget client')
        .populate('project.client', 'userName fullName profileImage')
        .sort({ completedAt: -1 })
        .limit(5);

    // Get recent gigs
    const recentGigs = await Gig.find({
        freelancer: userId
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title description price status rating orders views');

    // Get user's interaction stats
    const [savedCount, likedCount, dislikedCount] = await Promise.all([
        SavedProject.countDocuments({ user: userId }),
        LikedProject.countDocuments({ user: userId }),
        DislikedProject.countDocuments({ user: userId })
    ]);

    // Get total earnings (from completed applications)
    const totalEarnings = await Application.aggregate([
        {
            $match: {
                freelancer: userId,
                status: 'completed'
            }
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: '$proposedBudget' }
            }
        }
    ]);

    return {
        role: 'freelancer',
        stats: {
            applications: stats,
            totalApplications: Object.values(stats).reduce((a, b) => a + b, 0),
            totalEarnings: totalEarnings[0]?.totalEarnings || 0,
            interactions: {
                savedProjects: savedCount,
                likedProjects: likedCount,
                dislikedProjects: dislikedCount
            }
        },
        recentProjects,
        ongoingApplications,
        completedApplications,
        recentGigs,
        quickActions: [
            { name: 'Browse Projects', path: '/projects', icon: 'search' },
            { name: 'My Applications', path: '/applications', icon: 'file-text' },
            { name: 'Create Gig', path: '/gigs/create', icon: 'plus' },
            { name: 'Saved Projects', path: '/saved-projects', icon: 'bookmark' }
        ]
    };
};

// client dashboard data
const getClientDashboard = async (userId) => {
    // Get posted projects statistics
    const projectStats = await Project.aggregate([
        { $match: { client: userId } },
        {
            $group: {
                _id: '$projectStatus',
                count: { $sum: 1 }
            }
        }
    ]);

    const stats = projectStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
    }, {
        draft: 0,
        active: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
        paused: 0
    });

    // Get client's posted projects
    const postedProjects = await Project.find({
        client: userId
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title description budget projectStatus stats skillsRequired createdAt deadline');

    // Get latest applications received across all projects
    const latestApplications = await Application.find({})
        .populate('project', 'title budget client')
        .populate('freelancer', 'userName fullName profileImage averageRating skills')
        .sort({ createdAt: -1 })
        .limit(8)
        .then(applications =>
            applications.filter(app => app.project && app.project.client.toString() === userId.toString())
        );

    // Get active projects with ongoing work
    const activeProjects = await Project.find({
        client: userId,
        projectStatus: { $in: ['in_progress', 'active'] }
    })
        .populate('assignedFreelancer', 'userName fullName profileImage averageRating')
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title budget projectStatus assignedFreelancer deadline stats');

    // Get completed projects
    const completedProjects = await Project.find({
        client: userId,
        projectStatus: 'completed'
    })
        .populate('assignedFreelancer', 'userName fullName profileImage averageRating')
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('title budget assignedFreelancer completedAt');

    // Get latest gigs from platform (for hiring)
    const latestGigs = await Gig.find({
        status: 'active'
    })
        .populate('freelancer', 'userName fullName profileImage averageRating')
        .sort({ createdAt: -1 })
        .limit(6)
        .select('title description price deliveryTime rating orders skills category');

    // Get application statistics for client's projects
    const applicationCounts = await Application.aggregate([
        {
            $lookup: {
                from: 'projects',
                localField: 'project',
                foreignField: '_id',
                as: 'projectData'
            }
        },
        {
            $match: {
                'projectData.client': userId
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const applicationStats = applicationCounts.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
    }, {
        pending: 0,
        interviewing: 0,
        accepted: 0,
        rejected: 0,
        completed: 0
    });

    // Calculate total spending
    const totalSpending = await Application.aggregate([
        {
            $lookup: {
                from: 'projects',
                localField: 'project',
                foreignField: '_id',
                as: 'projectData'
            }
        },
        {
            $match: {
                'projectData.client': userId,
                status: 'completed'
            }
        },
        {
            $group: {
                _id: null,
                totalSpent: { $sum: '$proposedBudget' }
            }
        }
    ]);

    return {
        role: 'client',
        stats: {
            projects: stats,
            totalProjects: Object.values(stats).reduce((a, b) => a + b, 0),
            applications: applicationStats,
            totalSpent: totalSpending[0]?.totalSpent || 0
        },
        postedProjects,
        latestApplications: latestApplications.slice(0, 5),
        activeProjects,
        completedProjects,
        latestGigs,
        quickActions: [
            { name: 'Post Project', path: '/projects/create', icon: 'plus' },
            { name: 'Browse Freelancers', path: '/freelancers', icon: 'users' },
            { name: 'My Projects', path: '/projects/my', icon: 'folder' },
            { name: 'Received Applications', path: '/applications/received', icon: 'inbox' }
        ]
    };
};

// get dashboard statistics only (lighter endpoint)
const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!userId) throw new ApiError(400, "User ID not found");

    try {
        let stats = {};

        if (userRole === 'freelancer') {
            // Application statistics
            const applicationStats = await Application.aggregate([
                { $match: { freelancer: userId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]);

            const appStats = applicationStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {});

            // Interaction stats
            const [savedCount, likedCount, gigsCount] = await Promise.all([
                SavedProject.countDocuments({ user: userId }),
                LikedProject.countDocuments({ user: userId }),
                Gig.countDocuments({ freelancer: userId })
            ]);

            stats = {
                role: 'freelancer',
                applications: appStats,
                savedProjects: savedCount,
                likedProjects: likedCount,
                myGigs: gigsCount
            };
        } else if (userRole === 'client') {
            // Project statistics
            const projectStats = await Project.aggregate([
                { $match: { client: userId } },
                { $group: { _id: '$projectStatus', count: { $sum: 1 } } }
            ]);

            const projStats = projectStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {});

            // Application statistics for client's projects
            const applicationCounts = await Application.aggregate([
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project',
                        foreignField: '_id',
                        as: 'projectData'
                    }
                },
                { $match: { 'projectData.client': userId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]);

            const appStats = applicationCounts.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {});

            stats = {
                role: 'client',
                projects: projStats,
                applications: appStats
            };
        }

        return res.status(200).json(
            new ApiResponse(200, stats, "Dashboard statistics retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve dashboard statistics: " + error.message);
    }
});

export {
    getDashboardData,
    getDashboardStats
};