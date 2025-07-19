
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
    projectStatus: 'draft' // Start as draft
  };

  const project = await Project.create(projectData);
  if (!project) throw new ApiError(400, "Project creation failed");

  // Add audit log
  await project.addAuditLog('created', req.user._id, { initialData: projectData });

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

  // Add audit log
  await updatedProject.addAuditLog('updated', req.user._id, { changes: updateData });

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

  // Soft delete
  await project.softDelete(req.user._id);

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
    sortBy = 'newest'
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  // Build filter object
  const filters = {
    isActive: true,
    projectStatus: 'active'
  };

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
    filters['budget.min'] = {};
    if (budgetMin) filters['budget.min'].$gte = parseInt(budgetMin);
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

  // Add user interaction data if user is logged in
  let projectsWithInteractions = projects;
  if (req.user) {
    projectsWithInteractions = projects.map(project => {
      const interaction = project.getUserInteraction(req.user._id);

      return {
        ...project.toObject(),
        userInteraction: interaction
      };
    });
  }

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

  // Add user interaction data if user is logged in
  let projectData = project.toObject();
  if (req.user) {
    projectData.userInteraction = project.getUserInteraction(req.user._id);
  }

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

// POST: Like/Unlike project (Freelancers only)
const toggleLike = asyncHandler(async (req, res) => {
  if (req.user.role !== 'freelancer') {
    throw new ApiError(403, "Only freelancers can like projects");
  }

  const { projectId } = req.params;

  let project;
  if (projectId.match(/^[0-9a-fA-F]{24}$/)) {
    // It's an ObjectId
    project = await Project.findById(projectId);
  } else {
    // It's a slug
    project = await Project.findOne({ slug: projectId });
  }

  if (!project) throw new ApiError(404, "Project not found");

  const result = project.toggleLike(req.user._id);
  await project.save();

  // Add audit log
  await project.addAuditLog(result.action, req.user._id);

  res.status(200).send(new ApiResponse(200, result, `Project ${result.action} successfully`));
});

// POST: Dislike/Remove dislike project (Freelancers only)
const toggleDislike = asyncHandler(async (req, res) => {
  if (req.user.role !== 'freelancer') {
    throw new ApiError(403, "Only freelancers can dislike projects");
  }

  const { projectId } = req.params;

  let project;
  if (projectId.match(/^[0-9a-fA-F]{24}$/)) {
    // It's an ObjectId
    project = await Project.findById(projectId);
  } else {
    // It's a slug
    project = await Project.findOne({ slug: projectId });
  }

  if (!project) throw new ApiError(404, "Project not found");

  const result = project.toggleDislike(req.user._id);
  await project.save();

  // Add audit log
  await project.addAuditLog(result.action, req.user._id);

  res.status(200).send(new ApiResponse(200, result, `Project ${result.action} successfully`));
});

// POST: Bookmark/Unbookmark project (Freelancers only)
const toggleBookmark = asyncHandler(async (req, res) => {
  if (req.user.role !== 'freelancer') {
    throw new ApiError(403, "Only freelancers can bookmark projects");
  }

  const { projectId } = req.params;

  let project;
  if (projectId.match(/^[0-9a-fA-F]{24}$/)) {
    // It's an ObjectId
    project = await Project.findById(projectId);
  } else {
    // It's a slug
    project = await Project.findOne({ slug: projectId });
  }

  if (!project) throw new ApiError(404, "Project not found");

  const result = project.toggleBookmark(req.user._id);
  await project.save();

  // Add audit log
  await project.addAuditLog(result.action, req.user._id);

  res.status(200).send(new ApiResponse(200, result, `Project ${result.action} successfully`));
});

// GET: Get user's liked projects (Freelancers only)
const getLikedProjects = asyncHandler(async (req, res) => {
  if (req.user.role !== 'freelancer') {
    throw new ApiError(403, "Only freelancers can access liked projects");
  }

  const { page = 1, limit = 10 } = req.query;

  const projects = await Project.getUserLikedProjects(req.user._id, parseInt(limit))
    .populate("client", "fullName email avatar company")
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Project.countDocuments({ 'interactions.likes.user': req.user._id });

  res.status(200).send(new ApiResponse(200, {
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    projects,
  }, "Liked projects fetched successfully"));
});

// GET: Get user's bookmarked projects (Freelancers only)
const getBookmarkedProjects = asyncHandler(async (req, res) => {
  if (req.user.role !== 'freelancer') {
    throw new ApiError(403, "Only freelancers can access bookmarked projects");
  }

  const { page = 1, limit = 10 } = req.query;

  const projects = await Project.getUserBookmarkedProjects(req.user._id, parseInt(limit))
    .populate("client", "fullName email avatar company")
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Project.countDocuments({ 'interactions.bookmarks.user': req.user._id });

  res.status(200).send(new ApiResponse(200, {
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    projects,
  }, "Bookmarked projects fetched successfully"));
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

  // Add audit log
  await project.addAuditLog('status_changed', req.user._id, { newStatus: status });

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
  toggleLike,
  toggleDislike,
  toggleBookmark,
  getLikedProjects,
  getBookmarkedProjects,
  updateProjectStatus,
  getTrendingProjects,
  getMostLikedProjects
};



