import mongoose from "mongoose";
const { Schema } = mongoose;

const applicationSchema = new Schema({
        project: {
                type: Schema.Types.ObjectId,
                ref: 'Project',
                required: [true, "Project reference is required"],
                index: true
        },
        freelancer: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: [true, "Freelancer reference is required"],
                index: true
        },

        // Application Details
        proposedBudget: {
                type: Number,
                required: [true, "Proposed budget is required"],
                min: [1, "Proposed budget must be at least $1"]
        },
        expectedDelivery: {
                type: Number,
                required: [true, "Expected delivery time is required"],
                min: [1, "Expected delivery must be at least 1 day"]
        },
        coverLetter: {
                type: String,
                required: [true, "Cover letter is required"],
                minlength: [50, "Cover letter must be at least 50 characters"],
                maxlength: [5000, "Cover letter cannot exceed 5000 characters"]
        },

        // File Attachments
        attachments: [{
                filename: String,
                originalName: String,
                mimetype: String,
                size: Number,
                url: String,
                uploadedAt: {
                        type: Date,
                        default: Date.now
                }
        }],

        // Application Status
        status: {
                type: String,
                enum: [
                        'pending',
                        'interviewing',
                        'accepted',
                        'rejected',
                        'withdrawn',
                        'submitted',
                        'completed'
                ],
                default: 'pending',
                index: true
        },

        // Timestamps
        appliedAt: {
                type: Date,
                default: Date.now,
                index: true
        },
        acceptedAt: Date,
        rejectedAt: Date,
        withdrawnAt: Date,
        submittedAt: Date,
        completedAt: Date,
        updatedAt: {
                type: Date,
                default: Date.now
        },

        // Project Execution Details (for accepted applications)
        startDate: Date,
        deliverables: String,
        milestones: [{
                title: String,
                description: String,
                dueDate: Date,
                budget: Number,
                isCompleted: {
                        type: Boolean,
                        default: false
                },
                completedAt: Date
        }],

        // Proposal Analytics
        views: {
                type: Number,
                default: 0
        },
        responseTime: Number, // Time taken by client to respond in hours

}, {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
});

// Indexes for better query performance
applicationSchema.index({ project: 1, freelancer: 1 }, { unique: true });
applicationSchema.index({ freelancer: 1, status: 1 });
applicationSchema.index({ project: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

// Virtual for application age
applicationSchema.virtual('applicationAge').get(function () {
        return Date.now() - this.appliedAt;
});

// Pre-save middleware
applicationSchema.pre('save', function (next) {
        this.updatedAt = new Date();
        next();
});

// Static method to get application stats
applicationSchema.statics.getApplicationStats = function (userId, role) {
        const matchCondition = role === 'freelancer'
                ? { freelancer: userId }
                : { project: { $in: userId } }; // userId should be array of project IDs for clients

        return this.aggregate([
                { $match: matchCondition },
                {
                        $group: {
                                _id: '$status',
                                count: { $sum: 1 }
                        }
                }
        ]);
};

// Instance method to check if application can be edited
applicationSchema.methods.canBeEdited = function () {
        return this.status === 'pending';
};

// Instance method to check if application can be withdrawn
applicationSchema.methods.canBeWithdrawn = function () {
        return ['pending', 'interviewing'].includes(this.status);
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;