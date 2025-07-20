import { Router } from "express";
import {
    getDashboardData,
    getDashboardStats
} from "../controllers/dashboard.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyToken);

// GET /api/dashboard - Get complete dashboard data (role-based)
router.route("/").get(getDashboardData);

// GET /api/dashboard/stats - Get dashboard statistics only (lighter)
router.route("/stats").get(getDashboardStats);

export default router;
