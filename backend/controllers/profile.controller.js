import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user._id;

    const user = await User.findById(userId).select('-password -refreshToken -resetPasswordToken');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

// Update basic profile information
export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const updateData = req.body;

    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.refreshToken;
    delete updateData.resetPasswordToken;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken');

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

// Upload profile picture
export const uploadProfilePicture = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!req.file) {
        throw new ApiError(400, 'Profile picture file is required');
    }

    // Upload to cloudinary
    const uploadResult = await uploadOnCloudinary(req.file.path);

    if (!uploadResult) {
        throw new ApiError(500, 'Failed to upload profile picture');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profileImage: uploadResult.secure_url },
        { new: true }
    ).select('-password -refreshToken -resetPasswordToken');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Profile picture updated successfully'));
});

// Add experience
export const addExperience = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { jobTitle, company, startDate, endDate, current, description } = req.body;

    if (!jobTitle || !company || !startDate) {
        throw new ApiError(400, 'Job title, company, and start date are required');
    }

    const experienceData = {
        jobTitle,
        company,
        startDate: new Date(startDate),
        current: current || false,
        description
    };

    if (endDate && !current) {
        experienceData.endDate = new Date(endDate);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { experience: experienceData } },
        { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Experience added successfully'));
});

// Update experience
export const updateExperience = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { experienceId } = req.params;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const experienceIndex = user.experience.findIndex(exp => exp._id.toString() === experienceId);
    if (experienceIndex === -1) {
        throw new ApiError(404, 'Experience not found');
    }

    // Update the experience item
    Object.keys(updateData).forEach(key => {
        if (key === 'startDate' || key === 'endDate') {
            user.experience[experienceIndex][key] = new Date(updateData[key]);
        } else {
            user.experience[experienceIndex][key] = updateData[key];
        }
    });

    await user.save();

    const updatedUser = await User.findById(userId).select('-password -refreshToken -resetPasswordToken');
    res.status(200).json(new ApiResponse(200, updatedUser, 'Experience updated successfully'));
});

// Delete experience
export const deleteExperience = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { experienceId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { experience: { _id: experienceId } } },
        { new: true }
    ).select('-password -refreshToken -resetPasswordToken');

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, updatedUser, 'Experience deleted successfully'));
});

// Add education
export const addEducation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { degree, institution, startYear, endYear, grade } = req.body;

    if (!degree || !institution || !startYear) {
        throw new ApiError(400, 'Degree, institution, and start year are required');
    }

    const educationData = {
        degree,
        institution,
        startYear: parseInt(startYear),
        grade
    };

    if (endYear) {
        educationData.endYear = parseInt(endYear);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { education: educationData } },
        { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Education added successfully'));
});

// Update education
export const updateEducation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { educationId } = req.params;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const educationIndex = user.education.findIndex(edu => edu._id.toString() === educationId);
    if (educationIndex === -1) {
        throw new ApiError(404, 'Education not found');
    }

    // Update the education item
    Object.keys(updateData).forEach(key => {
        if (key === 'startYear' || key === 'endYear') {
            user.education[educationIndex][key] = parseInt(updateData[key]);
        } else {
            user.education[educationIndex][key] = updateData[key];
        }
    });

    await user.save();

    const updatedUser = await User.findById(userId).select('-password -refreshToken -resetPasswordToken');
    res.status(200).json(new ApiResponse(200, updatedUser, 'Education updated successfully'));
});

// Delete education
export const deleteEducation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { educationId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { education: { _id: educationId } } },
        { new: true }
    ).select('-password -refreshToken -resetPasswordToken');

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, updatedUser, 'Education deleted successfully'));
});

// Add certification
export const addCertification = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, issuer, year, credentialId, credentialUrl } = req.body;

    if (!name || !issuer || !year) {
        throw new ApiError(400, 'Name, issuer, and year are required');
    }

    const certificationData = {
        name,
        issuer,
        year: parseInt(year),
        credentialId,
        credentialUrl
    };

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { certifications: certificationData } },
        { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Certification added successfully'));
});

// Update certification
export const updateCertification = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { certificationId } = req.params;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const certificationIndex = user.certifications.findIndex(cert => cert._id.toString() === certificationId);
    if (certificationIndex === -1) {
        throw new ApiError(404, 'Certification not found');
    }

    // Update the certification item
    Object.keys(updateData).forEach(key => {
        if (key === 'year') {
            user.certifications[certificationIndex][key] = parseInt(updateData[key]);
        } else {
            user.certifications[certificationIndex][key] = updateData[key];
        }
    });

    await user.save();

    const updatedUser = await User.findById(userId).select('-password -refreshToken -resetPasswordToken');
    res.status(200).json(new ApiResponse(200, updatedUser, 'Certification updated successfully'));
});

// Delete certification
export const deleteCertification = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { certificationId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { certifications: { _id: certificationId } } },
        { new: true }
    ).select('-password -refreshToken -resetPasswordToken');

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, updatedUser, 'Certification deleted successfully'));
});

// Add portfolio item
export const addPortfolioItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { title, description, technologies, projectUrl, githubUrl, category, completedDate } = req.body;

    if (!title || !description) {
        throw new ApiError(400, 'Title and description are required');
    }

    const portfolioData = {
        title,
        description,
        technologies: technologies || [],
        projectUrl,
        githubUrl,
        category: category || 'Personal Project',
        completedDate: completedDate ? new Date(completedDate) : new Date(),
        images: []
    };

    // Handle file uploads for portfolio images
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const uploadResults = await Promise.all(uploadPromises);
        portfolioData.images = uploadResults.filter(result => result).map(result => result.secure_url);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { portfolio: portfolioData } },
        { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Portfolio item added successfully'));
});

// Update portfolio item
export const updatePortfolioItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { portfolioId } = req.params;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const portfolioIndex = user.portfolio.findIndex(item => item._id.toString() === portfolioId);
    if (portfolioIndex === -1) {
        throw new ApiError(404, 'Portfolio item not found');
    }

    // Update the portfolio item
    Object.keys(updateData).forEach(key => {
        if (key === 'completedDate') {
            user.portfolio[portfolioIndex][key] = new Date(updateData[key]);
        } else if (key === 'technologies' && Array.isArray(updateData[key])) {
            user.portfolio[portfolioIndex][key] = updateData[key];
        } else if (key !== 'images') {
            user.portfolio[portfolioIndex][key] = updateData[key];
        }
    });

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const uploadResults = await Promise.all(uploadPromises);
        const newImages = uploadResults.filter(result => result).map(result => result.secure_url);
        user.portfolio[portfolioIndex].images = [...user.portfolio[portfolioIndex].images, ...newImages];
    }

    await user.save();

    const updatedUser = await User.findById(userId).select('-password -refreshToken -resetPasswordToken');
    res.status(200).json(new ApiResponse(200, updatedUser, 'Portfolio item updated successfully'));
});

// Delete portfolio item
export const deletePortfolioItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { portfolioId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { portfolio: { _id: portfolioId } } },
        { new: true }
    ).select('-password -refreshToken -resetPasswordToken');

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, updatedUser, 'Portfolio item deleted successfully'));
});

// Add language
export const addLanguage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, level } = req.body;

    if (!name || !level) {
        throw new ApiError(400, 'Language name and proficiency level are required');
    }

    const languageData = { name, level };

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { languages: languageData } },
        { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Language added successfully'));
});

// Update language
export const updateLanguage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { languageId } = req.params;
    const { name, level } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const languageIndex = user.languages.findIndex(lang => lang._id.toString() === languageId);
    if (languageIndex === -1) {
        throw new ApiError(404, 'Language not found');
    }

    if (name) user.languages[languageIndex].name = name;
    if (level) user.languages[languageIndex].level = level;

    await user.save();

    const updatedUser = await User.findById(userId).select('-password -refreshToken -resetPasswordToken');
    res.status(200).json(new ApiResponse(200, updatedUser, 'Language updated successfully'));
});

// Delete language
export const deleteLanguage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { languageId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { languages: { _id: languageId } } },
        { new: true }
    ).select('-password -refreshToken -resetPasswordToken');

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, updatedUser, 'Language deleted successfully'));
});

// Calculate and update profile completion percentage
export const calculateProfileCompletion = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password -refreshToken -resetPasswordToken');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Define completion criteria
    const criteria = [
        user.fullName,
        user.email,
        user.bio,
        user.profileImage,
        user.skills && user.skills.length > 0,
        user.country,
        user.professionalTitle,
        user.phone,
        user.languages && user.languages.length > 0,
        user.experience && user.experience.length > 0,
        user.education && user.education.length > 0,
        user.portfolio && user.portfolio.length > 0
    ];

    const completedItems = criteria.filter(Boolean).length;
    const completionPercentage = Math.round((completedItems / criteria.length) * 100);

    res.status(200).json(new ApiResponse(200, {
        completionPercentage,
        completedItems,
        totalItems: criteria.length,
        missingFields: criteria.map((item, index) => {
            const fieldNames = [
                'fullName', 'email', 'bio', 'profileImage', 'skills',
                'country', 'professionalTitle', 'phone', 'languages',
                'experience', 'education', 'portfolio'
            ];
            return !item ? fieldNames[index] : null;
        }).filter(Boolean)
    }, 'Profile completion calculated successfully'));
});

// Send email verification
export const sendEmailVerification = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // TODO: Implement email verification logic
    // For now, just mark as verified (in production, send actual email)
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isEmailVerified: true },
        { new: true }
    ).select('-password -refreshToken -resetPasswordToken');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Email verification sent successfully'));
});

// Send phone verification
export const sendPhoneVerification = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // TODO: Implement phone verification logic
    // For now, just mark as verified (in production, send actual SMS)
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isPhoneVerified: true },
        { new: true }
    ).select('-password -refreshToken -resetPasswordToken');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Phone verification sent successfully'));
});
