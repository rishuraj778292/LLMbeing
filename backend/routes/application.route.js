import {
    apply,
    editApplication,
    withdrawApplication,
    acceptProposal,
    rejectProposal,
    getProjectApplications,
    getUserApplications,
    getClientApplications,
    submitProject,
    approveCompletion
} from "../controllers/application.controller.js";

import { Router } from 'express';
import verifyToken from "../middleware/verifyToken.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyToken);

// Freelancer routes
router.post("/apply/:projectId", apply); // POST /api/applications/apply/60d21bb67c...
router.put("/edit/:applicationId", editApplication); // PUT /api/applications/edit/60d21bb67c...
router.delete("/withdraw/:applicationId", withdrawApplication); // DELETE /api/applications/withdraw/60d21bb67c...
router.get("/my-applications", getUserApplications); // GET /api/applications/my-applications?page=1&limit=10&status=pending
router.put("/submit/:applicationId", submitProject); // PUT /api/applications/submit/60d21bb67c...

// Client routes
router.put("/accept/:applicationId", acceptProposal); // PUT /api/applications/accept/60d21bb67c...
router.put("/reject/:applicationId", rejectProposal); // PUT /api/applications/reject/60d21bb67c...
router.get("/project/:projectId", getProjectApplications); // GET /api/applications/project/60d21bb67c...
router.get("/my-projects", getClientApplications); // GET /api/applications/my-projects?page=1&limit=10&status=pending
router.put("/approve/:applicationId", approveCompletion); // PUT /api/applications/approve/60d21bb67c...

export default router;
