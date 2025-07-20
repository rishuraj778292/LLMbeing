import { Router } from "express";
import {
    apply,
    editApplication,
    withdrawApplication,
    acceptApplication,
    rejectApplication,
    submitProject,
    approveCompletion,
    getUserApplications,
    getClientApplications,
    getProjectApplications
} from "../controllers/application.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";

const router = Router();

// Apply middleware to all routes
router.use(verifyToken);

// Freelancer routes
router.post("/apply/:projectId", apply);
router.put("/edit/:applicationId", editApplication);
router.delete("/withdraw/:applicationId", withdrawApplication);
router.get("/my-applications", getUserApplications);
router.put("/submit/:applicationId", submitProject);

// Client routes
router.put("/accept/:applicationId", acceptApplication);
router.put("/reject/:applicationId", rejectApplication);
router.put("/approve/:applicationId", approveCompletion);
router.get("/client-applications", getClientApplications);
router.get("/project/:projectId", getProjectApplications);

export default router;