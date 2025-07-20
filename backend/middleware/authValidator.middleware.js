import { ApiError } from "../utils/ApiError.js";
import { body, validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";

// Reusable validation chains
const emailValidation = body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format");

const passwordValidation = body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character");

const usernameValidation = body("userName")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters long");

const roleValidation = body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["freelancer", "client", "admin"]).withMessage("Invalid role selected");

// Forgot password validation
const forgotPasswordValidation = body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format");

// OTP validation
const otpValidation = body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits")
    .isNumeric().withMessage("OTP must contain only numbers");

// Email OTP validation
const emailOTPValidation = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    otpValidation
];

// Password reset OTP validation
const passwordResetOTPValidation = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    otpValidation
];

// Reset password validation
const resetPasswordValidation = [
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),
    body("confirmPassword")
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

// Centralized error handling middleware
const handleValidationErrors = asyncHandler((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
        }));
        throw new ApiError(400, "Validation failed", formattedErrors);
    }
    next();
});

// Registration validation middleware
const registerValidator = [
    emailValidation,
    passwordValidation,
    usernameValidation,
    roleValidation,
    handleValidationErrors,
];

// Forgot password validation middleware
const forgotPasswordValidator = [
    forgotPasswordValidation,
    handleValidationErrors,
];

// Reset password validation middleware
const resetPasswordValidator = [
    ...resetPasswordValidation,
    handleValidationErrors,
];

// Email OTP validation middleware
const emailOTPValidator = [
    ...emailOTPValidation,
    handleValidationErrors,
];

// Password reset OTP validation middleware
const passwordResetOTPValidator = [
    ...passwordResetOTPValidation,
    handleValidationErrors,
];

export { registerValidator, forgotPasswordValidator, resetPasswordValidator, emailOTPValidator, passwordResetOTPValidator };

