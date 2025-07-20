import { Router } from "express";
import { register, verifyEmailOTP, resendEmailOTP, login, verifyUser, refreshtoken, logoutUser, forgotPassword, verifyPasswordResetOTP, resetPassword, checkUsernameAvailability } from "../controllers/auth.controller.js";
import { registerValidator, forgotPasswordValidator, resetPasswordValidator, emailOTPValidator, passwordResetOTPValidator } from "../middleware/authValidator.middleware.js";
import verifyToken from "../middleware/verifyToken.middleware.js";
const router = Router();

router.route("/register").post(registerValidator, register);
router.route("/verify-email").post(emailOTPValidator, verifyEmailOTP);
router.route("/resend-otp").post(forgotPasswordValidator, resendEmailOTP);
router.route("/login").post(login);
router.route("/verifyUser").get(verifyToken, verifyUser);
router.route("/refreshtoken").get(refreshtoken);
router.route("/logout").get(logoutUser);

// Username availability check (public endpoint)
router.route("/check-username/:username").get(checkUsernameAvailability);

// Password reset routes with OTP
router.route("/forgot-password").post(forgotPasswordValidator, forgotPassword);
router.route("/verify-reset-otp").post(passwordResetOTPValidator, verifyPasswordResetOTP);
router.route("/reset-password/:token").post(resetPasswordValidator, resetPassword);

export default router;