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

export  {registerValidator};

