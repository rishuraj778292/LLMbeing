import { Router } from "express";
import {
    getUserSavedProjects,
    toggleSaveProject,
    deleteSavedProject,
    deleteAllSavedProjects
} from "../controllers/savedProject.controller.js";
import verifyToken  from "../middleware/verifyToken.middleware.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyToken);

// GET /api/saved-projects - Get user's saved projects with pagination
router.route("/").get(getUserSavedProjects);

// POST /api/saved-projects/toggle/:projectId - Toggle save/unsave project
router.route("/toggle/:projectId").post(toggleSaveProject);

// DELETE /api/saved-projects/:projectId - Delete specific saved project
router.route("/:projectId").delete(deleteSavedProject);

// DELETE /api/saved-projects/all - Delete all saved projects
router.route("/all").delete(deleteAllSavedProjects);

export default router;
