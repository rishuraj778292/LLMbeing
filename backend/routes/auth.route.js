import { Router } from "express";
import { register,login } from "../controllers/auth.controller.js";
import { registerValidator } from "../middleware/authValidator.middleware.js";
const router = Router();

router.route("/register").post(registerValidator ,register)
router.route("/login").post(login)


export default router;