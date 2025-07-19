
import {
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    getProjectDetails,
    getOwnProjects,
    toggleLike,
    toggleDislike,
    toggleBookmark,
    getLikedProjects,
    getBookmarkedProjects,
    updateProjectStatus,
    getTrendingProjects,
    getMostLikedProjects
} from "../controllers/project.controller.js";

import { Router } from 'express';
import { verifyAccess, validateProjectdata } from "../middleware/projectValidate.middleware.js";
import verifyToken from "../middleware/verifyToken.middleware.js";

const router = Router();

// Public routes (no authentication required)
router.get("/", getAllProjects); // GET /api/projects?page=1&limit=10&search=...
router.get("/trending", getTrendingProjects); // GET /api/projects/trending?days=7&limit=10
router.get("/most-liked", getMostLikedProjects); // GET /api/projects/most-liked?limit=10
router.get("/:identifier", getProjectDetails); // GET /api/projects/project-slug or /api/projects/60d21bb67c...

// Client-only routes (authentication + client role required)
router.post("/", verifyAccess, validateProjectdata, createProject); // POST /api/projects
router.get("/my/projects", verifyAccess, getOwnProjects); // GET /api/projects/my/projects?status=active
router.put("/:projectId", verifyAccess, updateProject); // PUT /api/projects/60d21bb67c...
router.delete("/:projectId", verifyAccess, deleteProject); // DELETE /api/projects/60d21bb67c...
router.put("/:projectId/status", verifyAccess, updateProjectStatus); // PUT /api/projects/60d21bb67c.../status

// Freelancer-only routes (authentication + freelancer role required)
router.post("/:projectId/like", verifyToken, toggleLike); // POST /api/projects/60d21bb67c.../like
router.post("/:projectId/dislike", verifyToken, toggleDislike); // POST /api/projects/60d21bb67c.../dislike
router.post("/:projectId/bookmark", verifyToken, toggleBookmark); // POST /api/projects/60d21bb67c.../bookmark

// Freelancer interaction routes
router.get("/my/liked", verifyToken, getLikedProjects); // GET /api/projects/my/liked
router.get("/my/bookmarked", verifyToken, getBookmarkedProjects); // GET /api/projects/my/bookmarked

export default router;

