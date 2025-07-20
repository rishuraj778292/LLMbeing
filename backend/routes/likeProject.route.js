import { Router } from "express";
import {
    getUserLikedProjects,
    toggleLikeProject,
    toggleDislikeProject,
    getProjectLikers,
    deleteLikedProject,
    deleteAllLikedProjects,
    getProjectLikeStatus
} from "../controllers/likeProject.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyToken);

// GET /api/liked-projects - Get user's liked projects with pagination
router.route("/").get(getUserLikedProjects);

// POST /api/liked-projects/like/:projectId - Toggle like project
router.route("/like/:projectId").post(toggleLikeProject);

// POST /api/liked-projects/dislike/:projectId - Toggle dislike project
router.route("/dislike/:projectId").post(toggleDislikeProject);

// GET /api/liked-projects/status/:projectId - Get user's like/dislike status for project
router.route("/status/:projectId").get(getProjectLikeStatus);

// GET /api/liked-projects/likers/:projectId - Get project likers
router.route("/likers/:projectId").get(getProjectLikers);

// DELETE /api/liked-projects/:projectId - Delete specific liked project
router.route("/:projectId").delete(deleteLikedProject);

// DELETE /api/liked-projects/all - Delete all liked projects
router.route("/all").delete(deleteAllLikedProjects);

export default router;
