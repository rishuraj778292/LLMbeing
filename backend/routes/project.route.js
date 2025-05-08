
import {
    createProject,
    getAllProjects,
    getProjectBySlug,
    getOwnProjects,
    deleteProject,
    updateProject
} from "../controllers/project.controller.js";

import { Router } from 'express';
import { verifyAccess, validateProjectdata } from "../middleware/projectValidate.middleware.js";

const router = Router();

// Public routes
router.get("/fetchProjects", getAllProjects);
router.get("/fetchprojectdetails/:slug", getProjectBySlug);

// Client-protected routes
router.post("/post", verifyAccess, validateProjectdata, createProject);
router.get("/fetchOwnproject", verifyAccess, getOwnProjects);
router.put("/edit/:id", verifyAccess, updateProject);
router.delete("/delete/:id", verifyAccess, deleteProject);

export default router;

