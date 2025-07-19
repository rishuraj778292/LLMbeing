import mongoose, { Types } from "mongoose";
import Project from "./project.model.js";
import User from './user.model.js'
const { Schema } = mongoose;

const applicationSchema = mongoose.Schema({
        // Core application fields
        project: {
                type: Schema.Types.ObjectId,
                ref: 'Project',
                required: true,
                index: true
        },
        freelancer: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                index: true
        },
        client: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                index: true
        },

        // Application details
        proposedBudget: {
                type: Number,
                required: true,
                min: 0
        },
        expectedDelivery: {
                type: Number, // in days
                required: true,
                min: 1
        },
        coverLetter: {
                type: String,
                required: true,
                maxlength: 2000
        },
        attachments: [{
                filename: String,
                url: String,
                size: Number
        }],

        // Application status and dates
        status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'submitted', 'completed'],
                default: 'pending',
                index: true
        },
        appliedAt: {
                type: Date,
                default: Date.now
        },
        lastModified: {
                type: Date,
                default: Date.now
        },

        // Status-specific dates
        acceptedAt: Date,
        rejectedAt: Date,
        withdrawnAt: Date,
        submittedAt: Date,
        completedAt: Date,

        // Client feedback
        clientMessage: {
                type: String,
                maxlength: 1000
        },

        // Project execution details (for accepted applications)
        projectStartDate: Date,
        milestones: [{
                title: String,
                description: String,
                dueDate: Date,
                completed: { type: Boolean, default: false },
                completedAt: Date
        }],

        // Submission details (when freelancer submits work)
        submissionMessage: {
                type: String,
                maxlength: 2000
        },
        deliverables: [{
                title: String,
                description: String,
                url: String
        }],
        submissionAttachments: [{
                filename: String,
                url: String,
                size: Number
        }],

        // Completion and feedback
        clientRating: {
                type: Number,
                min: 1,
                max: 5
        },
        clientReview: {
                type: String,
                maxlength: 1000
        },
        freelancerRating: {
                type: Number,
                min: 1,
                max: 5
        },
        freelancerReview: {
                type: String,
                maxlength: 1000
        },
        tip: {
                type: Number,
                default: 0,
                min: 0
        }
}, {
        timestamps: true
});

// Indexes for better performance
applicationSchema.index({ project: 1, freelancer: 1 }, { unique: true });
applicationSchema.index({ freelancer: 1, status: 1 });
applicationSchema.index({ project: 1, status: 1 });
applicationSchema.index({ client: 1, status: 1 }); // For client to quickly find their applications
applicationSchema.index({ client: 1, createdAt: -1 }); // For chronological listing

// Pre-save middleware to update lastModified
applicationSchema.pre('save', function (next) {
        if (this.isModified() && !this.isNew) {
                this.lastModified = new Date();
        }
        next();
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;