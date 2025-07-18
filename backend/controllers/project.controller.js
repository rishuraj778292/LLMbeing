
import Project from '../models/project.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST: Create a new project
const createProject = asyncHandler(async (req, res) => {
  const projectData = {
    ...req.body,
    client: req.user._id,
  }
  const project = await Project.create(projectData);
  if (!project) throw new ApiError(400, "Project not posted");
  res.status(201).send(new ApiResponse(201, project, "Project posted successfully"));
});

// GET: All projects with pagination for infinite scroll
const getAllProjects = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const total = await Project.countDocuments();
  const projects = await Project.find({})
    .populate("client", "email fullName")
    .sort({ createdAt: -1 }) // newest first
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).send(new ApiResponse(200, {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    projects,
  }, "Projects fetched successfully"));
});

// GET: Get project by slug
const getProjectBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const project = await Project.findOne({ slug }).populate("client", "email fullName");
  if (!project) throw new ApiError(404, "Project not found");
  res.status(200).send(new ApiResponse(200, project, "Project fetched successfully"));
});

// GET: Get current client's project
const getOwnProjects = asyncHandler(async (req, res) => {
  const clientId = req.user._id;
  const projects = await Project.find({ client: clientId }).sort({ createdAt: -1 });
  res.status(200).send(new ApiResponse(200, projects, "Your projects fetched"));
});

// PUT: Update project by ID
const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedProject) throw new ApiError(404, "Project not found");
  res.status(200).send(new ApiResponse(200, updatedProject, "Project updated"));
});

// DELETE: Delete project by ID
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedProject = await Project.findByIdAndDelete(id);
  if (!deletedProject) throw new ApiError(404, "Project not found");
  res.status(200).send(new ApiResponse(200, deletedProject, "Project deleted"));
});

export {
  createProject,
  getAllProjects,
  getProjectBySlug,
  getOwnProjects,
  updateProject,
  deleteProject
};


// saved Project
//Get
const getSavedProjects = asyncHandler((req, res) => {

})
//post

// delete


// applied project
//Get

//post

// delete


// Active project
//Get

//post

// delete


// completed  project
//Get

//post

// delete



