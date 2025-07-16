import express from 'express';
import {
    getUserProfile,
    updateProfile,
    uploadProfilePicture,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertification,
    updateCertification,
    deleteCertification,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    calculateProfileCompletion,
    sendEmailVerification,
    sendPhoneVerification
} from '../controllers/profile.controller.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

// Profile routes
router.get('/profile', verifyToken, getUserProfile);
router.get('/profile/:userId', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateProfile);
router.post('/profile/upload-picture', verifyToken, upload.single('profilePicture'), uploadProfilePicture);
router.get('/profile-completion', verifyToken, calculateProfileCompletion);

// Experience routes
router.post('/experience', verifyToken, addExperience);
router.put('/experience/:experienceId', verifyToken, updateExperience);
router.delete('/experience/:experienceId', verifyToken, deleteExperience);

// Education routes
router.post('/education', verifyToken, addEducation);
router.put('/education/:educationId', verifyToken, updateEducation);
router.delete('/education/:educationId', verifyToken, deleteEducation);

// Certification routes
router.post('/certification', verifyToken, addCertification);
router.put('/certification/:certificationId', verifyToken, updateCertification);
router.delete('/certification/:certificationId', verifyToken, deleteCertification);

// Portfolio routes
router.post('/portfolio', verifyToken, upload.array('images', 5), addPortfolioItem);
router.put('/portfolio/:portfolioId', verifyToken, upload.array('images', 5), updatePortfolioItem);
router.delete('/portfolio/:portfolioId', verifyToken, deletePortfolioItem);

// Language routes
router.post('/language', verifyToken, addLanguage);
router.put('/language/:languageId', verifyToken, updateLanguage);
router.delete('/language/:languageId', verifyToken, deleteLanguage);

// Verification routes
router.post('/verify-email', verifyToken, sendEmailVerification);
router.post('/verify-phone', verifyToken, sendPhoneVerification);

export default router;
