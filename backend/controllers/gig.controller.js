import Gig from "../models/gig.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// POST: Create a new gig
const addGig = asyncHandler(async (req, res) => {
    const freelancerId = req.user._id;

    // Note: Role verification is already handled by verifyAccess middleware
    // Model validation will handle required field validation

    const gig = await Gig.create({
        ...req.body,
        freelancer: freelancerId
    });

    if (!gig) throw new ApiError(500, "Failed to create gig");

    // Populate freelancer details with comprehensive profile data
    await gig.populate('freelancer', 'fullName email avatar profile skills rating location');

    res.status(201).json(new ApiResponse(201, gig, "Gig created successfully"));
});

// PUT: Update an existing gig
const updateGig = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const freelancerId = req.user._id;

    // Find the gig first
    const gig = await Gig.findById(id);
    if (!gig) throw new ApiError(404, "Gig not found");

    // Check if the user owns this gig
    if (gig.freelancer.toString() !== freelancerId.toString()) {
        throw new ApiError(403, "You can only update your own gigs");
    }

    const updatedGig = await Gig.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    ).populate('freelancer', 'fullName email avatar profile skills rating location');

    if (!updatedGig) throw new ApiError(500, "Failed to update gig");

    res.status(200).json(new ApiResponse(200, updatedGig, "Gig updated successfully"));
});

// DELETE: Remove a gig
const removeGig = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const freelancerId = req.user._id;

    // Find the gig first
    const gig = await Gig.findById(id);
    if (!gig) throw new ApiError(404, "Gig not found");

    // Check if the user owns this gig
    if (gig.freelancer.toString() !== freelancerId.toString()) {
        throw new ApiError(403, "You can only delete your own gigs");
    }

    const removedGig = await Gig.findByIdAndDelete(id);
    if (!removedGig) throw new ApiError(500, "Failed to delete gig");

    res.status(200).json(new ApiResponse(200, removedGig, "Gig deleted successfully"));
});

// GET: Find all gigs with filters and pagination
const findGigs = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        category,
        minPrice,
        maxPrice,
        skills,
        search,
        status = 'active',
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    // Build filter object - only show active gigs by default
    const filter = { status };

    if (category) {
        filter.category = category;
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
        filter.skills = { $in: skillsArray };
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { skills: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } }
        ];
    }

    // Build sort object with more options
    let sort = {};
    switch (sortBy) {
        case 'price':
            sort = { price: sortOrder === 'desc' ? -1 : 1 };
            break;
        case 'rating':
            sort = { 'rating.average': sortOrder === 'desc' ? -1 : 1, 'rating.count': -1 };
            break;
        case 'orders':
            sort = { orders: sortOrder === 'desc' ? -1 : 1 };
            break;
        case 'views':
            sort = { views: sortOrder === 'desc' ? -1 : 1 };
            break;
        case 'popular':
            sort = { orders: -1, 'rating.average': -1, views: -1 };
            break;
        default:
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [gigs, total] = await Promise.all([
        Gig.find(filter)
            .populate('freelancer', 'fullName email avatar profile skills rating location')
            .sort(sort)
            .skip(skip)
            .limit(limitNum),
        Gig.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const response = {
        gigs,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }
    };

    res.status(200).json(new ApiResponse(200, response, "Gigs fetched successfully"));
});

// GET: Get gig by ID
const getGigById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const gig = await Gig.findById(id)
        .populate('freelancer', 'fullName email avatar profile skills rating location');

    if (!gig) throw new ApiError(404, "Gig not found");

    // Increment view count (analytics)
    gig.views += 1;
    await gig.save();

    res.status(200).json(new ApiResponse(200, gig, "Gig fetched successfully"));
});

// GET: Get user's gigs
const getUserGigs = asyncHandler(async (req, res) => {
    const freelancerId = req.user._id;
    const { page = 1, limit = 12, status } = req.query;

    const filter = { freelancer: freelancerId };
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [gigs, total] = await Promise.all([
        Gig.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Gig.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const response = {
        gigs,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }
    };

    res.status(200).json(new ApiResponse(200, response, "User gigs fetched successfully"));
});

// PUT: Update gig status
const updateGigStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const freelancerId = req.user._id;

    // Find the gig first
    const gig = await Gig.findById(id);
    if (!gig) throw new ApiError(404, "Gig not found");

    // Check ownership
    if (gig.freelancer.toString() !== freelancerId.toString()) {
        throw new ApiError(403, "You can only update your own gigs");
    }

    // Validate status
    const allowedStatuses = ['draft', 'active', 'paused', 'inactive'];
    if (!allowedStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    gig.status = status;
    await gig.save();

    res.status(200).json(new ApiResponse(200, gig, "Gig status updated successfully"));
});

export {
    addGig,
    updateGig,
    removeGig,
    findGigs,
    getGigById,
    getUserGigs,
    updateGigStatus
};