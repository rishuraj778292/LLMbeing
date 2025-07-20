import { Router } from "express";
import {
    getUserDislikedProjects,
    toggleDislikeProject,
    getProjectDislikers,
    deleteDislikedProject,
    deleteAllDislikedProjects,
    getProjectDislikeStatus,
    getTopDislikedProjects
} from "../controllers/dislikeProject.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyToken);

// GET /api/disliked-projects - Get user's disliked projects with pagination
router.route("/").get(getUserDislikedProjects);

// POST /api/disliked-projects/dislike/:projectId - Toggle dislike project
router.route("/dislike/:projectId").post(toggleDislikeProject);

// GET /api/disliked-projects/status/:projectId - Get user's dislike status for project
router.route("/status/:projectId").get(getProjectDislikeStatus);

// GET /api/disliked-projects/dislikers/:projectId - Get project dislikers
router.route("/dislikers/:projectId").get(getProjectDislikers);

// GET /api/disliked-projects/top - Get top disliked projects (analytics)
router.route("/top").get(getTopDislikedProjects);

// DELETE /api/disliked-projects/:projectId - Delete specific disliked project
router.route("/:projectId").delete(deleteDislikedProject);

// DELETE /api/disliked-projects/all - Delete all disliked projects
router.route("/all").delete(deleteAllDislikedProjects);

export default router;
