
import {
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    getProjectDetails,
    getOwnProjects,
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

// Note: Project interactions (like/dislike/save) are handled by separate controllers:
// - likeProject.controller.js
// - dislikeProject.controller.js  
// - savedProject.controller.js

export default router;

