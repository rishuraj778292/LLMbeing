import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Application from "../models/application.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import contentFilter from "../utils/contentFilter.js";


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

        // Content validation for cover letter
        const contentValidation = contentFilter.validateContent(coverLetter);
        if (!contentValidation.isValid) {
                // Log the content violation for monitoring
                contentFilter.logViolation(applicantId, { coverLetter }, [{
                        field: 'coverLetter',
                        reason: contentValidation.reason,
                        flaggedWords: contentValidation.flaggedWords
                }]);

                throw new ApiError(400, "Cover letter contains inappropriate content. Please review and modify your content to ensure appropriate.");
        }

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) throw new ApiError(404, "Project not found");

        if (project.isActive !== true) {
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

        // Rate limiting: Prevent spam applications (max 10 applications per day)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentApplications = await Application.countDocuments({
                freelancer: applicantId,
                appliedAt: { $gte: twentyFourHoursAgo }
        });

        if (recentApplications >= 10) {
                throw new ApiError(429, "Too many applications submitted today. Please try again tomorrow.");
        }

        // Check application deadline (if set)
        if (project.applicationDeadline && new Date() > new Date(project.applicationDeadline)) {
                const deadline = new Date(project.applicationDeadline).toLocaleDateString();
                throw new ApiError(400, `Application deadline (${deadline}) has passed`);
        }

        // Convert string values to numbers
        const numericBudget = parseFloat(proposedBudget);
        const numericDelivery = parseInt(expectedDelivery);

        if (isNaN(numericBudget) || numericBudget <= 0) {
                throw new ApiError(400, "Invalid proposed budget");
        }

        if (isNaN(numericDelivery) || numericDelivery <= 0) {
                throw new ApiError(400, "Invalid expected delivery time");
        }

        // Create application
        try {
                const application = await Application.create({
                        project: projectId,
                        freelancer: applicantId,
                        proposedBudget: numericBudget,
                        expectedDelivery: numericDelivery,
                        coverLetter,
                        attachments: attachments || [],
                        status: 'pending',
                        appliedAt: new Date()
                });

                // Increment project application count
                await Project.findByIdAndUpdate(projectId, {
                        $inc: { 'stats.applicationCount': 1 }
                });

                // Add to user's applied projects array (hybrid storage)
                await User.findByIdAndUpdate(applicantId, {
                        $addToSet: { appliedProjects: projectId }
                });

                const populatedApplication = await Application.findById(application._id)
                        .populate('project', 'title budget client projectStatus slug')
                        .populate('freelancer', 'fullName email avatar')
                        .populate('project.client', 'fullName email avatar company');

                res.status(201).send(new ApiResponse(201, populatedApplication, "Application submitted successfully"));
        } catch (error) {
                // Check for MongoDB duplicate key error
                if (error.code === 11000 && error.keyPattern && (error.keyPattern.project || error.keyPattern['project_1_freelancer_1'])) {
                        throw new ApiError(400, "You have already applied to this project");
                }
                // Re-throw other errors
                throw error;
        }
});

// PUT: Edit application
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

        // Validate and update fields
        if (proposedBudget !== undefined) {
                const numericBudget = parseFloat(proposedBudget);
                if (isNaN(numericBudget) || numericBudget <= 0) {
                        throw new ApiError(400, "Invalid proposed budget");
                }
                application.proposedBudget = numericBudget;
        }

        if (expectedDelivery !== undefined) {
                const numericDelivery = parseInt(expectedDelivery);
                if (isNaN(numericDelivery) || numericDelivery <= 0) {
                        throw new ApiError(400, "Invalid expected delivery time");
                }
                application.expectedDelivery = numericDelivery;
        }

        if (coverLetter !== undefined) {
                if (!coverLetter.trim()) {
                        throw new ApiError(400, "Cover letter cannot be empty");
                }

                // Content validation for updated cover letter
                const contentValidation = contentFilter.validateContent(coverLetter);
                if (!contentValidation.isValid) {
                        throw new ApiError(400, "Cover letter contains inappropriate content. Please review and modify your content to ensure it's professional and appropriate.");
                }

                application.coverLetter = coverLetter;
        }

        if (attachments !== undefined) {
                application.attachments = attachments;
        }

        application.updatedAt = new Date();
        await application.save();

        const populatedApplication = await Application.findById(application._id)
                .populate('project', 'title budget client projectStatus slug')
                .populate('freelancer', 'fullName email avatar');

        res.status(200).send(new ApiResponse(200, populatedApplication, "Application updated successfully"));
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

// PUT: Accept application (Client only)
const acceptApplication = asyncHandler(async (req, res) => {
        if (req.user.role !== 'client') {
                throw new ApiError(403, "Only clients can accept applications");
        }

        const { applicationId } = req.params;
        const { message, startDate, milestones } = req.body;

        // Find the application with populated project
        const application = await Application.findById(applicationId).populate('project');
        if (!application) throw new ApiError(404, "Application not found");

        // Check if user owns the project
        if (application.project.client.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only accept applications for your own projects");
        }

        // Check if application is pending
        if (application.status !== 'pending') {
                throw new ApiError(400, `Cannot accept application with status: ${application.status}`);
        }

        // Content validation for client message
        if (message && message.trim()) {
                const messageValidation = contentFilter.validateContent(message);
                if (!messageValidation.isValid) {
                        throw new ApiError(400, "Client message contains inappropriate content. Please review and modify your message.");
                }
        }

        // Update application status
        application.status = 'accepted';
        application.acceptedAt = new Date();
        if (message) application.clientMessage = message;
        if (startDate) application.startDate = new Date(startDate);
        if (milestones) application.milestones = milestones;

        await application.save();

        // Update project status to in_progress and set assigned freelancer
        await Project.findByIdAndUpdate(application.project._id, {
                projectStatus: 'in_progress',
                assignedFreelancer: application.freelancer,
                acceptedBudget: application.proposedBudget,
                startDate: application.startDate || new Date()
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
                        clientMessage: 'Project assigned to another freelancer'
                }
        );

        const populatedApplication = await Application.findById(application._id)
                .populate('project', 'title budget client projectStatus slug')
                .populate('freelancer', 'fullName email avatar');

        res.status(200).send(new ApiResponse(200, populatedApplication, "Application accepted successfully"));
});

// PUT: Reject application (Client only)
const rejectApplication = asyncHandler(async (req, res) => {
        if (req.user.role !== 'client') {
                throw new ApiError(403, "Only clients can reject applications");
        }

        const { applicationId } = req.params;
        const { message } = req.body;

        // Find the application with populated project
        const application = await Application.findById(applicationId).populate('project');
        if (!application) throw new ApiError(404, "Application not found");

        // Check if user owns the project
        if (application.project.client.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only reject applications for your own projects");
        }

        // Check if application is pending
        if (application.status !== 'pending') {
                throw new ApiError(400, `Cannot reject application with status: ${application.status}`);
        }

        // Content validation for rejection message
        if (message && message.trim()) {
                const messageValidation = contentFilter.validateContent(message);
                if (!messageValidation.isValid) {
                        throw new ApiError(400, "Rejection message contains inappropriate content. Please review and modify your message.");
                }
        }

        // Update application status
        application.status = 'rejected';
        application.rejectedAt = new Date();
        if (message) application.clientMessage = message;

        await application.save();

        // Decrease project application count
        await Project.findByIdAndUpdate(application.project._id, {
                $inc: { 'stats.applicationCount': -1 }
        });

        res.status(200).send(new ApiResponse(200, application, "Application rejected successfully"));
});

// PUT: Submit project (Freelancer only)
const submitProject = asyncHandler(async (req, res) => {
        if (req.user.role !== 'freelancer') {
                throw new ApiError(403, "Only freelancers can submit projects");
        }

        const { applicationId } = req.params;
        const { deliverables, message, attachments } = req.body;

        // Find the application
        const application = await Application.findById(applicationId).populate('project');
        if (!application) throw new ApiError(404, "Application not found");

        // Check ownership
        if (application.freelancer.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only submit your own projects");
        }

        // Check if application is accepted
        if (application.status !== 'accepted') {
                throw new ApiError(400, "Can only submit accepted projects");
        }

        // Validate required fields
        if (!deliverables || !message) {
                throw new ApiError(400, "Deliverables and message are required");
        }

        // Content validation for deliverables and message
        const deliverablesValidation = contentFilter.validateContent(deliverables);
        const messageValidation = contentFilter.validateContent(message);

        if (!deliverablesValidation.isValid) {
                throw new ApiError(400, "Deliverables description contains inappropriate content. Please review and modify your content.");
        }

        if (!messageValidation.isValid) {
                throw new ApiError(400, "Submission message contains inappropriate content. Please review and modify your content.");
        }

        // Update application
        application.status = 'submitted';
        application.submittedAt = new Date();
        application.deliverables = deliverables;
        application.freelancerMessage = message;
        if (attachments) application.attachments = [...(application.attachments || []), ...attachments];

        await application.save();

        // Update project status
        await Project.findByIdAndUpdate(application.project._id, {
                projectStatus: 'submitted'
        });

        const populatedApplication = await Application.findById(application._id)
                .populate('project', 'title budget client projectStatus slug')
                .populate('freelancer', 'fullName email avatar');

        res.status(200).send(new ApiResponse(200, populatedApplication, "Project submitted successfully"));
});

// PUT: Approve completion (Client only)
const approveCompletion = asyncHandler(async (req, res) => {
        if (req.user.role !== 'client') {
                throw new ApiError(403, "Only clients can approve project completion");
        }

        const { applicationId } = req.params;
        const { rating, feedback, tip } = req.body;

        // Find the application
        const application = await Application.findById(applicationId).populate('project');
        if (!application) throw new ApiError(404, "Application not found");

        // Check ownership
        if (application.project.client.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only approve projects you own");
        }

        // Check if project is submitted
        if (application.status !== 'submitted') {
                throw new ApiError(400, "Can only approve submitted projects");
        }

        // Validate rating
        if (rating && (rating < 1 || rating > 5)) {
                throw new ApiError(400, "Rating must be between 1 and 5");
        }

        // Content validation for client feedback
        if (feedback && feedback.trim()) {
                const feedbackValidation = contentFilter.validateContent(feedback);
                if (!feedbackValidation.isValid) {
                        throw new ApiError(400, "Feedback contains inappropriate content. Please review and modify your feedback.");
                }
        }

        // Update application
        application.status = 'completed';
        application.completedAt = new Date();
        if (rating) application.rating = rating;
        if (feedback) application.clientFeedback = feedback;
        if (tip) application.tip = parseFloat(tip);

        await application.save();

        // Update project status
        await Project.findByIdAndUpdate(application.project._id, {
                projectStatus: 'completed',
                completedAt: new Date()
        });

        // Update freelancer stats (you might want to add this to user model)
        // await User.findByIdAndUpdate(application.freelancer, {
        //     $inc: { 'stats.completedProjects': 1 }
        // });

        const populatedApplication = await Application.findById(application._id)
                .populate('project', 'title budget client projectStatus slug')
                .populate('freelancer', 'fullName email avatar');

        res.status(200).send(new ApiResponse(200, populatedApplication, "Project completion approved successfully"));
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

        // First get all projects owned by the client
        const clientProjects = await Project.find({ client: req.user._id }).select('_id');
        const projectIds = clientProjects.map(p => p._id);

        // Build filter
        const filter = { project: { $in: projectIds } };
        if (status) filter.status = status;
        if (projectId) filter.project = projectId;

        const applications = await Application.find(filter)
                .populate('project', 'title budget projectStatus slug')
                .populate('freelancer', 'fullName email avatar rating completedProjects')
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
        }, "Client applications fetched successfully"));
});

// GET: Get applications for a specific project (Client only)
const getProjectApplications = asyncHandler(async (req, res) => {
        const { projectId } = req.params;
        const { page = 1, limit = 10, status } = req.query;

        // Find the project and check ownership
        const project = await Project.findById(projectId);
        if (!project) throw new ApiError(404, "Project not found");

        if (req.user.role === 'client' && project.client.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You can only view applications for your own projects");
        }

        // Build filter
        const filter = { project: projectId };
        if (status) filter.status = status;

        const applications = await Application.find(filter)
                .populate('freelancer', 'fullName email avatar rating completedProjects skills location')
                .sort({ createdAt: -1 })
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit));

        const total = await Application.countDocuments(filter);

        // Get application stats
        const stats = await Application.aggregate([
                { $match: { project: project._id } },
                {
                        $group: {
                                _id: '$status',
                                count: { $sum: 1 }
                        }
                }
        ]);

        const applicationStats = stats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
        }, {});

        res.status(200).send(new ApiResponse(200, {
                applications,
                stats: applicationStats,
                pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total,
                        totalPages: Math.ceil(total / parseInt(limit))
                }
        }, "Project applications fetched successfully"));
});

export {
        apply,
        editApplication,
        withdrawApplication,
        acceptApplication,
        rejectApplication,
        submitProject,
        approveCompletion,
        getUserApplications,
        getClientApplications,
        getProjectApplications
};