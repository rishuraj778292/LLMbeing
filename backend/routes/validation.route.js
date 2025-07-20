/**
 * Content Validation Routes
 * Provides endpoints for real-time content validation
 */

import express from 'express';
import { quickContentCheck } from '../middleware/contentValidation.middleware.js';
import { verifyToken } from '../middleware/verifyToken.middleware.js';

const router = express.Router();

/**
 * @route POST /api/validate/content
 * @desc Quick content validation for real-time feedback
 * @access Private
 */
router.post('/content', verifyToken, quickContentCheck);

/**
 * @route POST /api/validate/project
 * @desc Validate entire project data before submission
 * @access Private
 */
router.post('/project', verifyToken, (req, res) => {
    try {
        const contentFilter = require('../utils/contentFilter.js').default;
        const validation = contentFilter.validateProject(req.body);

        res.json({
            isValid: validation.isValid,
            message: validation.isValid
                ? 'Project content is appropriate and ready for submission'
                : contentFilter.getErrorMessage(validation.violatedFields),
            details: validation.isValid ? null : validation.violatedFields
        });
    } catch (error) {
        console.error('Project validation error:', error);
        res.status(500).json({
            isValid: false,
            message: 'Validation service temporarily unavailable'
        });
    }
});

export default router;
