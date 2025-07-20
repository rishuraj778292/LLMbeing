/**
 * Content Validation Middleware
 * Validates project content for inappropriate material before saving
 */

import contentFilter from '../utils/contentFilter.js';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to validate project content
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
export const validateProjectContent = (req, res, next) => {
    try {
        const projectData = req.body;

        // Skip validation for certain operations if needed
        if (req.method === 'DELETE' || req.path.includes('/stats/')) {
            return next();
        }

        // Validate the project content
        const validation = contentFilter.validateProject(projectData);

        if (!validation.isValid) {
            // Log the violation for monitoring
            const userId = req.user?.id || req.body.client || 'unknown';
            contentFilter.logViolation(userId, projectData, validation.violatedFields);

            // Return user-friendly error
            const errorMessage = contentFilter.getErrorMessage(validation.violatedFields);

            throw new ApiError(400, errorMessage, validation.violatedFields);
        }

        // Content is clean, proceed
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        console.error('Content validation error:', error);
        throw new ApiError(500, 'Content validation failed. Please try again.');
    }
};

/**
 * Middleware specifically for project updates
 * More lenient for existing projects being updated
 */
export const validateProjectUpdateContent = (req, res, next) => {
    try {
        const updateData = req.body;

        // Only validate fields that are being updated
        const fieldsToValidate = {};

        if (updateData.title) fieldsToValidate.title = updateData.title;
        if (updateData.description) fieldsToValidate.description = updateData.description;
        if (updateData.requirements) fieldsToValidate.requirements = updateData.requirements;
        if (updateData.applicationSettings) fieldsToValidate.applicationSettings = updateData.applicationSettings;

        // If no content fields are being updated, skip validation
        if (Object.keys(fieldsToValidate).length === 0) {
            return next();
        }

        const validation = contentFilter.validateProject(fieldsToValidate);

        if (!validation.isValid) {
            const userId = req.user?.id || 'unknown';
            contentFilter.logViolation(userId, fieldsToValidate, validation.violatedFields);

            const errorMessage = contentFilter.getErrorMessage(validation.violatedFields);
            throw new ApiError(400, errorMessage, validation.violatedFields);
        }

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        console.error('Content validation error during update:', error);
        throw new ApiError(500, 'Content validation failed. Please try again.');
    }
};

/**
 * Quick content check for real-time validation (less strict)
 * Can be used for API endpoints that provide real-time feedback
 */
export const quickContentCheck = (req, res, next) => {
    try {
        const { text, field } = req.body;

        if (!text) {
            return res.json({ isValid: true, message: 'No content to validate' });
        }

        const result = contentFilter.validateContent(text);

        res.json({
            isValid: result.isValid,
            message: result.isValid ? 'Content is appropriate' : 'Content contains inappropriate material',
            field: field || 'unknown'
        });
    } catch (error) {
        console.error('Quick content check error:', error);
        res.status(500).json({
            isValid: false,
            message: 'Content validation service temporarily unavailable'
        });
    }
};

export default {
    validateProjectContent,
    validateProjectUpdateContent,
    quickContentCheck
};
