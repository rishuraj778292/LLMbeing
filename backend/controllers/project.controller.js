
import Project from '../models/project.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST: Create a new project (Client only)
const createProject = asyncHandler(async (req, res) => {
  // Check if user is a client
  if (req.user.role !== 'client') {
    throw new ApiError(403, "Only clients can create projects");
  }

  const projectData = {
    ...req.body,
    client: req.user._id,
    projectStatus: 'active' // Start as draft
  };

  const project = await Project.create(projectData);
  if (!project) throw new ApiError(400, "Project creation failed");

  res.status(201).send(new ApiResponse(201, project, "Project created successfully"));
});

// PUT: Update project (Client only - own projects)
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const updateData = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Check ownership
  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own projects");
  }

  // Prevent updates if project is completed or cancelled
  if (['completed', 'cancelled'].includes(project.projectStatus)) {
    throw new ApiError(400, "Cannot update completed or cancelled projects");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    updateData,
    { new: true, runValidators: true }
  ).populate("client", "fullName email avatar");

  res.status(200).send(new ApiResponse(200, updatedProject, "Project updated successfully"));
});

// DELETE: Soft delete project (Client only - own projects)
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Check ownership
  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own projects");
  }

  // Soft delete - just deactivate the project
  project.isActive = false;
  project.projectStatus = 'cancelled';
  await project.save();

  res.status(200).send(new ApiResponse(200, {}, "Project deleted successfully"));
});

// GET: All active projects with advanced filtering (Public - for freelancers)
const getAllProjects = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    search,
    categories,
    skills,
    experienceLevel,
    projectType,
    budgetMin,
    budgetMax,
    location,
    sortBy = 'newest',
    includeAllStatuses = 'false'  // Add parameter for showing all statuses
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  // Build filter object
  const filters = {
    isActive: true  // Keep this to filter out deleted projects
  };

  // Only apply projectStatus filter if not including all statuses
  if (includeAllStatuses !== 'true') {
    filters.projectStatus = 'active';
  }

  if (search) {
    filters.$text = { $search: search };
  }

  if (categories) {
    filters.projectCategory = { $in: categories.split(',') };
  }

  if (skills) {
    filters.skillsRequired = { $in: skills.split(',') };
  }

  if (experienceLevel) {
    filters.experienceLevel = experienceLevel;
  }

  if (projectType) {
    filters.projectType = projectType;
  }

  if (budgetMin || budgetMax) {
    if (budgetMin) filters['budget.min'] = { $gte: parseInt(budgetMin) };
    if (budgetMax) filters['budget.max'] = { $lte: parseInt(budgetMax) };
  }

  if (location) {
    filters['location.type'] = location;
  }

  // Build sort object
  let sortObject = {};
  switch (sortBy) {
    case 'newest':
      sortObject = { createdAt: -1 };
      break;
    case 'oldest':
      sortObject = { createdAt: 1 };
      break;
    case 'budget-high':
      sortObject = { 'budget.max': -1 };
      break;
    case 'budget-low':
      sortObject = { 'budget.min': 1 };
      break;
    case 'popular':
      sortObject = { 'stats.likeCount': -1, 'stats.viewCount': -1 };
      break;
    case 'trending':
      // For trending, we'll use the static method
      const trendingProjects = await Project.getTrendingProjects(7, limit * page);
      const total = await Project.countDocuments(filters);

      return res.status(200).send(new ApiResponse(200, {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        projects: trendingProjects.slice((page - 1) * limit, page * limit),
      }, "Trending projects fetched successfully"));
    default:
      sortObject = { createdAt: -1 };
  }

  const total = await Project.countDocuments(filters);
  const projects = await Project.find(filters)
    .populate("client", "fullName email avatar company")
    .sort(sortObject)
    .skip((page - 1) * limit)
    .limit(limit);

  // Add user interaction data if user is logged in - remove this as it should be handled separately
  let projectsWithInteractions = projects;
  // Note: User interactions (like, dislike, save) should be fetched separately from interaction controllers

  res.status(200).send(new ApiResponse(200, {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    projects: projectsWithInteractions,
  }, "Projects fetched successfully"));
});

// GET: Get project by ID/slug with full details
const getProjectDetails = asyncHandler(async (req, res) => {
  const { identifier } = req.params; // Can be ID or slug

  let project;
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    // It's an ObjectId
    project = await Project.findById(identifier);
  } else {
    // It's a slug
    project = await Project.findOne({ slug: identifier });
  }

  if (!project) throw new ApiError(404, "Project not found");

  // Populate detailed information
  await project.populate([
    { path: "client", select: "fullName email avatar company location createdAt" },
    { path: "assignedFreelancer", select: "fullName email avatar skills rating" }
  ]);

  // Increment view count (but not for the project owner)
  if (!req.user || project.client._id.toString() !== req.user._id.toString()) {
    project.stats.viewCount += 1;
    await project.save();
  }

  // Add user interaction data if user is logged in - remove this as it should be handled separately
  let projectData = project.toObject();
  // Note: User interactions (like, dislike, save) should be fetched separately from interaction controllers

  res.status(200).send(new ApiResponse(200, projectData, "Project details fetched successfully"));
});

// GET: Get client's own projects
const getOwnProjects = asyncHandler(async (req, res) => {
  if (req.user.role !== 'client') {
    throw new ApiError(403, "Only clients can access this endpoint");
  }

  const { status, page = 1, limit = 10 } = req.query;
  const filters = { client: req.user._id };

  if (status) {
    filters.projectStatus = status;
  }

  const total = await Project.countDocuments(filters);
  const projects = await Project.find(filters)
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

  res.status(200).send(new ApiResponse(200, {
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    projects,
  }, "Your projects fetched successfully"));
});

// PUT: Update project status (Client only - own projects)
const updateProjectStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Check ownership
  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own projects");
  }

  const allowedStatuses = ['draft', 'active', 'in_progress', 'completed', 'cancelled', 'paused'];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  project.projectStatus = status;
  await project.save();

  res.status(200).send(new ApiResponse(200, project, "Project status updated successfully"));
});

// GET: Get trending projects
const getTrendingProjects = asyncHandler(async (req, res) => {
  const { days = 7, limit = 10 } = req.query;

  const projects = await Project.getTrendingProjects(parseInt(days), parseInt(limit));

  res.status(200).send(new ApiResponse(200, projects, "Trending projects fetched successfully"));
});

// GET: Get most liked projects
const getMostLikedProjects = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const projects = await Project.getMostLikedProjects(parseInt(limit))
    .populate("client", "fullName email avatar company");

  res.status(200).send(new ApiResponse(200, projects, "Most liked projects fetched successfully"));
});

export {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectDetails,
  getOwnProjects,
  updateProjectStatus,
  getTrendingProjects,
  getMostLikedProjects
};



