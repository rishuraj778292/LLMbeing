import { Router } from 'express';
import {
    addGig,
    updateGig,
    removeGig,
    findGigs,
    getGigById,
    getUserGigs,
    updateGigStatus
} from '../controllers/gig.controller.js';
import { verifyAccess, verifyData } from '../middleware/gigsValidator.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';

const router = Router();

// Public routes
router.route("/").get(findGigs); // GET /api/v1/gigs - Browse all gigs
router.route("/:id").get(getGigById); // GET /api/v1/gigs/:id - Get specific gig

// Protected routes (require authentication)
router.use(verifyToken); // Apply authentication to all routes below

router.route("/").post(verifyAccess, verifyData, addGig); // POST /api/v1/gigs - Create new gig
router.route("/my-gigs").get(getUserGigs); // GET /api/v1/gigs/my-gigs - Get user's gigs
router.route("/:id").put(verifyAccess, updateGig); // PUT /api/v1/gigs/:id - Update gig
router.route("/:id").delete(verifyAccess, removeGig); // DELETE /api/v1/gigs/:id - Delete gig
router.route("/:id/status").put(verifyAccess, updateGigStatus); // PUT /api/v1/gigs/:id/status - Update gig status

export default router;