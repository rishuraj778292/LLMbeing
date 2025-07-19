import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Application from "../models/application.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";


// POST: Apply to project
const apply = asyncHandler(async (req, res) => {
        if (req.user.role !== 'freelancer') {
                throw new ApiError(403, "Only freelancers can apply to projects");
        }

        const { proposedBudget, expectedDelivery, coverLetter, attachments } = req.body;
        const { projectId } = req.params;
        const applicantId = req.user._id;

        if (!projectId) throw new ApiError(400, "Invalid project ID");

        // Validate required fields
        if (!proposedBudget) throw new ApiError(400, "Proposed budget is required");
        if (!expectedDelivery) throw new ApiError(400, "Expected delivery time is required");
        if (!coverLetter) throw new ApiError(400, "Cover letter is required");

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) throw new ApiError(404, "Project not found");

        if (project.projectStatus !== 'active') {
                throw new ApiError(400, "Cannot apply to inactive projects");
        }

        // Check if user already applied (excluding withdrawn applications)
        const existingApplication = await Application.findOne({
                project: projectId,
                freelancer: applicantId,
                status: { $nin: ['withdrawn'] }
        });

        if (existingApplication) {
                throw new ApiError(400, "You have already applied to this project");
        }

        // Check if project owner
        if (project.client.toString() === applicantId.toString()) {
                throw new ApiError(400, "You cannot apply to your own project");
        }

        // Check application deadline (if set)
        if (project.applicationDeadline && new Date() > new Date(project.applicationDeadline)) {
                throw new ApiError(400, "Application deadline has passed");
        }

        // Check max applications limit (if set)
        if (project.maxApplications && project.stats.applicationCount >= project.maxApplications) {
                throw new ApiError(400, "Maximum number of applications reached for this project");
        }

        // Create application
        const application = await Application.create({
                project: projectId,
                freelancer: applicantId,
                client: project.client, // Add client for easy tracking
                proposedBudget,
                expectedDelivery,
                coverLetter,
                attachments: attachments || [],
                status: 'pending',
                appliedAt: new Date()
        });

        // Update project application count
        await Project.findByIdAndUpdate(projectId, {
                $inc: { 'stats.applicationCount': 1 }
        });

        // Update user's applied projects array (hybrid storage)
        await User.findByIdAndUpdate(applicantId, {
                $addToSet: { appliedProjects: projectId }
        });

        // Populate the application with necessary details
        await application.populate([
                { path: 'project', select: 'title budget client projectStatus' },
                { path: 'freelancer', select: 'fullName email avatar skills' }
        ]);

        res.status(201).send(new ApiResponse(201, application, "Application submitted successfully"));
});

// PUT: Edit applied project (only if status is pending)
const editApplication = asyncHandler(async (req, res) => {
        if (req.user.role !== 'freelancer') {
                throw new ApiError(403, "Only freelancers can edit applications");
        }

        const { applicationId } = req.params;
        const { proposedBudget, expectedDelivery, coverLetter, attachments } = req.body;

        // Find the application
        const application = await Application.findById(applicationId);
        if (!application) throw new ApiError(404, "Application not found");

        // Check ownership
        if (application.freelancer.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only edit your own applications");
        }

        // Check if application can be edited (only pending applications)
        if (application.status !== 'pending') {
                throw new ApiError(400, `Cannot edit application with status: ${application.status}`);
        }

        // Check if project is still active
        const project = await Project.findById(application.project);
        if (!project || project.projectStatus !== 'active') {
                throw new ApiError(400, "Cannot edit application for inactive project");
        }

        // Update application
        const updatedFields = {};
        if (proposedBudget !== undefined) updatedFields.proposedBudget = proposedBudget;
        if (expectedDelivery !== undefined) updatedFields.expectedDelivery = expectedDelivery;
        if (coverLetter !== undefined) updatedFields.coverLetter = coverLetter;
        if (attachments !== undefined) updatedFields.attachments = attachments;

        updatedFields.lastModified = new Date();

        const updatedApplication = await Application.findByIdAndUpdate(
                applicationId,
                updatedFields,
                { new: true, runValidators: true }
        ).populate([
                { path: 'project', select: 'title budget client projectStatus' },
                { path: 'freelancer', select: 'fullName email avatar skills' }
        ]);

        res.status(200).send(new ApiResponse(200, updatedApplication, "Application updated successfully"));
});

// DELETE: Withdraw application
const withdrawApplication = asyncHandler(async (req, res) => {
        if (req.user.role !== 'freelancer') {
                throw new ApiError(403, "Only freelancers can withdraw applications");
        }

        const { applicationId } = req.params;

        // Find the application
        const application = await Application.findById(applicationId);
        if (!application) throw new ApiError(404, "Application not found");

        // Check ownership
        if (application.freelancer.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only withdraw your own applications");
        }

        // Check if application can be withdrawn (not accepted or completed)
        if (['accepted', 'completed'].includes(application.status)) {
                throw new ApiError(400, `Cannot withdraw application with status: ${application.status}`);
        }

        // Update application status to withdrawn
        application.status = 'withdrawn';
        application.withdrawnAt = new Date();
        await application.save();

        // Decrease project application count
        await Project.findByIdAndUpdate(application.project, {
                $inc: { 'stats.applicationCount': -1 }
        });

        // Remove from user's applied projects array (hybrid storage)
        await User.findByIdAndUpdate(req.user._id, {
                $pull: { appliedProjects: application.project }
        });

        res.status(200).send(new ApiResponse(200, application, "Application withdrawn successfully"));
});

// PUT: Accept proposal (Client only)
const acceptProposal = asyncHandler(async (req, res) => {
        if (req.user.role !== 'client') {
                throw new ApiError(403, "Only clients can accept proposals");
        }

        const { applicationId } = req.params;
        const { message, startDate, milestones } = req.body;

        // Find the application
        const application = await Application.findById(applicationId).populate('project');
        if (!application) throw new ApiError(404, "Application not found");

        // Check if user owns the project
        if (application.project.client.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only accept proposals for your own projects");
        }

        // Check if application is still pending
        if (application.status !== 'pending') {
                throw new ApiError(400, `Cannot accept application with status: ${application.status}`);
        }

        // Check if project is still active
        if (application.project.projectStatus !== 'active') {
                throw new ApiError(400, "Cannot accept proposal for inactive project");
        }

        // Accept the application
        application.status = 'accepted';
        application.acceptedAt = new Date();
        application.clientMessage = message;
        application.projectStartDate = startDate || new Date();
        if (milestones) application.milestones = milestones;
        await application.save();

        // Update project status to assigned and set freelancer
        await Project.findByIdAndUpdate(application.project._id, {
                projectStatus: 'in_progress',
                assignedFreelancer: application.freelancer,
                startDate: application.projectStartDate,
                acceptedBudget: application.proposedBudget
        });

        // Add project to freelancer's active projects (hybrid storage)
        await User.findByIdAndUpdate(application.freelancer, {
                $addToSet: { activeProjects: application.project._id }
        });

        // Add project to client's active projects
        await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { activeProjects: application.project._id }
        });

        // Reject all other pending applications for this project
        await Application.updateMany(
                {
                        project: application.project._id,
                        _id: { $ne: applicationId },
                        status: 'pending'
                },
                {
                        status: 'rejected',
                        rejectedAt: new Date(),
                        clientMessage: 'Project was awarded to another freelancer'
                }
        );

        // Populate response
        await application.populate([
                { path: 'project', select: 'title budget client projectStatus' },
                { path: 'freelancer', select: 'fullName email avatar skills' }
        ]);

        res.status(200).send(new ApiResponse(200, application, "Proposal accepted successfully"));
});

// PUT: Reject proposal (Client only)
const rejectProposal = asyncHandler(async (req, res) => {
        if (req.user.role !== 'client') {
                throw new ApiError(403, "Only clients can reject proposals");
        }

        const { applicationId } = req.params;
        const { message } = req.body;

        // Find the application
        const application = await Application.findById(applicationId).populate('project');
        if (!application) throw new ApiError(404, "Application not found");

        // Check if user owns the project
        if (application.project.client.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only reject proposals for your own projects");
        }

        // Check if application is still pending
        if (application.status !== 'pending') {
                throw new ApiError(400, `Cannot reject application with status: ${application.status}`);
        }

        // Reject the application
        application.status = 'rejected';
        application.rejectedAt = new Date();
        application.clientMessage = message || 'Your proposal was not selected for this project';
        await application.save();

        // Remove from freelancer's applied projects array (hybrid storage)
        await User.findByIdAndUpdate(application.freelancer, {
                $pull: { appliedProjects: application.project._id }
        });

        // Populate response
        await application.populate([
                { path: 'project', select: 'title budget client projectStatus' },
                { path: 'freelancer', select: 'fullName email avatar skills' }
        ]);

        res.status(200).send(new ApiResponse(200, application, "Proposal rejected successfully"));
});

// GET: Get applications for a project (Client only)
const getProjectApplications = asyncHandler(async (req, res) => {
        if (req.user.role !== 'client') {
                throw new ApiError(403, "Only clients can view project applications");
        }

        const { projectId } = req.params;
        const { page = 1, limit = 10, status } = req.query;

        // Check if user owns the project
        const project = await Project.findById(projectId);
        if (!project) throw new ApiError(404, "Project not found");

        if (project.client.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only view applications for your own projects");
        }

        // Build filter
        const filter = { project: projectId };
        if (status) filter.status = status;

        const applications = await Application.find(filter)
                .populate('freelancer', 'fullName email avatar skills professionalTitle hourlyRate')
                .populate('project', 'title budget')
                .sort({ createdAt: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit));

        const total = await Application.countDocuments(filter);

        res.status(200).send(new ApiResponse(200, {
                applications,
                pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages: Math.ceil(total / parseInt(limit))
                }
        }, "Project applications fetched successfully"));
});

// GET: Get user's applications (Freelancer only)
const getUserApplications = asyncHandler(async (req, res) => {
        if (req.user.role !== 'freelancer') {
                throw new ApiError(403, "Only freelancers can view their applications");
        }

        const { page = 1, limit = 10, status } = req.query;

        // Build filter (exclude withdrawn applications by default)
        const filter = {
                freelancer: req.user._id,
                status: { $ne: 'withdrawn' }
        };
        if (status) {
                if (status === 'withdrawn') {
                        // If specifically requesting withdrawn applications, include them
                        filter.status = 'withdrawn';
                } else {
                        filter.status = status;
                }
        }

        const applications = await Application.find(filter)
                .populate('project', 'title budget client projectStatus slug description location skillsRequired duration')
                .populate('project.client', 'fullName email avatar company')
                .sort({ createdAt: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit));

        const total = await Application.countDocuments(filter);

        res.status(200).send(new ApiResponse(200, {
                applications,
                pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages: Math.ceil(total / parseInt(limit))
                }
        }, "User applications fetched successfully"));
});

// GET: Get all applications for a client across all projects (Client only)
const getClientApplications = asyncHandler(async (req, res) => {
        if (req.user.role !== 'client') {
                throw new ApiError(403, "Only clients can view their applications");
        }

        const { page = 1, limit = 10, status, projectId } = req.query;

        // Build filter
        const filter = { client: req.user._id };
        if (status) filter.status = status;
        if (projectId) filter.project = projectId;

        const applications = await Application.find(filter)
                .populate('freelancer', 'fullName email avatar skills professionalTitle hourlyRate')
                .populate('project', 'title budget projectStatus')
                .sort({ createdAt: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit));

        const total = await Application.countDocuments(filter);

        // Get summary statistics
        const stats = await Application.aggregate([
                { $match: { client: req.user._id } },
                {
                        $group: {
                                _id: '$status',
                                count: { $sum: 1 }
                        }
                }
        ]);

        const summary = {
                total: total,
                pending: stats.find(s => s._id === 'pending')?.count || 0,
                accepted: stats.find(s => s._id === 'accepted')?.count || 0,
                rejected: stats.find(s => s._id === 'rejected')?.count || 0,
                completed: stats.find(s => s._id === 'completed')?.count || 0
        };

        res.status(200).send(new ApiResponse(200, {
                applications,
                summary,
                pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages: Math.ceil(total / parseInt(limit))
                }
        }, "Client applications fetched successfully"));
});

// PUT: Mark project as completed (Freelancer submits work)
const submitProject = asyncHandler(async (req, res) => {
        if (req.user.role !== 'freelancer') {
                throw new ApiError(403, "Only freelancers can submit projects");
        }

        const { applicationId } = req.params;
        const { submissionMessage, deliverables, attachments } = req.body;

        // Find the application
        const application = await Application.findById(applicationId).populate('project');
        if (!application) throw new ApiError(404, "Application not found");

        // Check ownership
        if (application.freelancer.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only submit work for your own applications");
        }

        // Check if application is accepted
        if (application.status !== 'accepted') {
                throw new ApiError(400, "Can only submit work for accepted applications");
        }

        // Update application status to submitted
        application.status = 'submitted';
        application.submittedAt = new Date();
        application.submissionMessage = submissionMessage;
        application.deliverables = deliverables;
        application.submissionAttachments = attachments || [];
        await application.save();

        // Update project status
        await Project.findByIdAndUpdate(application.project._id, {
                projectStatus: 'submitted'
        });

        res.status(200).send(new ApiResponse(200, application, "Project submitted successfully"));
});

// PUT: Client approves completion and marks project as completed
const approveCompletion = asyncHandler(async (req, res) => {
        if (req.user.role !== 'client') {
                throw new ApiError(403, "Only clients can approve project completion");
        }

        const { applicationId } = req.params;
        const { rating, review, tip } = req.body;

        // Find the application
        const application = await Application.findById(applicationId).populate('project');
        if (!application) throw new ApiError(404, "Application not found");

        // Check ownership
        if (application.project.client.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only approve completion for your own projects");
        }

        // Check if application is submitted
        if (application.status !== 'submitted') {
                throw new ApiError(400, "Can only approve completion for submitted projects");
        }

        // Update application status to completed
        application.status = 'completed';
        application.completedAt = new Date();
        application.clientRating = rating;
        application.clientReview = review;
        application.tip = tip || 0;
        await application.save();

        // Update project status
        await Project.findByIdAndUpdate(application.project._id, {
                projectStatus: 'completed',
                completedAt: new Date()
        });

        // Move project from active to completed for both users (hybrid storage)
        await User.findByIdAndUpdate(application.freelancer, {
                $pull: { activeProjects: application.project._id },
                $addToSet: { completedProjects: application.project._id },
                $inc: { completedProjectsCount: 1 }
        });

        await User.findByIdAndUpdate(req.user._id, {
                $pull: { activeProjects: application.project._id },
                $addToSet: { completedProjects: application.project._id }
        });

        res.status(200).send(new ApiResponse(200, application, "Project completion approved successfully"));
});

export {
        apply,
        editApplication,
        withdrawApplication,
        acceptProposal,
        rejectProposal,
        getProjectApplications,
        getUserApplications,
        getClientApplications,
        submitProject,
        approveCompletion
};


// edit applied project


//withdraw


// by client
// accept  proposal

// reject proposal