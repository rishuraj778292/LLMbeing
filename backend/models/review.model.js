import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = new Schema({
    // Core Relationships
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Reviewer is required"],
        index: true
    },
    reviewee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Reviewee is required"],
        index: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Project reference is required"],
        index: true
    },
    gig: {
        type: Schema.Types.ObjectId,
        ref: 'Gig',
        default: null
    },
    contract: {
        type: Schema.Types.ObjectId,
        ref: 'Contract',
        default: null
    },

    // Rating System
    overallRating: {
        type: Number,
        required: [true, "Overall rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
        validate: {
            validator: function (v) {
                return Number.isInteger(v * 2); // Allow 0.5 increments
            },
            message: "Rating must be in 0.5 increments"
        }
    },

    // Detailed Rating Categories
    categoryRatings: {
        communication: {
            type: Number,
            min: [1, "Communication rating must be at least 1"],
            max: [5, "Communication rating cannot exceed 5"],
            required: [true, "Communication rating is required"]
        },
        quality: {
            type: Number,
            min: [1, "Quality rating must be at least 1"],
            max: [5, "Quality rating cannot exceed 5"],
            required: [true, "Quality rating is required"]
        },
        delivery: {
            type: Number,
            min: [1, "Delivery rating must be at least 1"],
            max: [5, "Delivery rating cannot exceed 5"],
            required: [true, "Delivery rating is required"]
        },
        professionalism: {
            type: Number,
            min: [1, "Professionalism rating must be at least 1"],
            max: [5, "Professionalism rating cannot exceed 5"],
            required: [true, "Professionalism rating is required"]
        },
        valueForMoney: {
            type: Number,
            min: [1, "Value for money rating must be at least 1"],
            max: [5, "Value for money rating cannot exceed 5"],
            required: [true, "Value for money rating is required"]
        }
    },

    // Review Content
    title: {
        type: String,
        required: [true, "Review title is required"],
        trim: true,
        minlength: [5, "Title must be at least 5 characters"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    content: {
        type: String,
        required: [true, "Review content is required"],
        trim: true,
        minlength: [20, "Review must be at least 20 characters"],
        maxlength: [2000, "Review cannot exceed 2000 characters"]
    },

    // Review Metadata
    reviewType: {
        type: String,
        enum: ['client_to_freelancer', 'freelancer_to_client'],
        required: [true, "Review type is required"],
        index: true
    },

    // Recommendation
    wouldRecommend: {
        type: Boolean,
        required: [true, "Recommendation status is required"]
    },

    // Helpful Feedback
    helpfulVotes: {
        type: Number,
        default: 0,
        min: [0, "Helpful votes cannot be negative"]
    },

    // Users who found this review helpful
    helpfulBy: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Moderation
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'flagged'],
        default: 'pending',
        index: true
    },
    moderationNotes: {
        type: String,
        trim: true
    },
    moderatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    moderatedAt: {
        type: Date
    },

    // Response from reviewee
    response: {
        content: {
            type: String,
            trim: true,
            maxlength: [1000, "Response cannot exceed 1000 characters"]
        },
        respondedAt: {
            type: Date
        }
    },

    // Flags and Reports
    isReported: {
        type: Boolean,
        default: false
    },
    reportCount: {
        type: Number,
        default: 0
    },
    reports: [{
        reporter: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: {
            type: String,
            enum: ['inappropriate', 'fake', 'spam', 'offensive', 'irrelevant', 'other']
        },
        description: String,
        reportedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Visibility
    isVisible: {
        type: Boolean,
        default: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },

    // Soft Delete
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
reviewSchema.index({ reviewer: 1, reviewee: 1, project: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1, status: 1, isVisible: 1 });
reviewSchema.index({ reviewer: 1, createdAt: -1 });
reviewSchema.index({ overallRating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ helpfulVotes: -1 });
reviewSchema.index({ reviewType: 1, status: 1 });

// Text search index
reviewSchema.index({
    title: 'text',
    content: 'text'
});

// Compound index for filtering
reviewSchema.index({
    status: 1,
    isVisible: 1,
    deletedAt: 1
});

// Virtual for average category rating
reviewSchema.virtual('averageCategoryRating').get(function () {
    const ratings = this.categoryRatings;
    const sum = ratings.communication + ratings.quality + ratings.delivery +
        ratings.professionalism + ratings.valueForMoney;
    return Math.round((sum / 5) * 2) / 2; // Round to nearest 0.5
});

// Virtual for helpful percentage
reviewSchema.virtual('helpfulPercentage').get(function () {
    if (this.helpfulVotes === 0) return 0;
    return Math.round((this.helpfulVotes / (this.helpfulVotes + this.reportCount)) * 100);
});

// Pre-save middleware
reviewSchema.pre('save', function (next) {
    // Auto-calculate overall rating from category ratings if not provided
    if (!this.overallRating && this.categoryRatings) {
        this.overallRating = this.averageCategoryRating;
    }

    // Validate that reviewer and reviewee are different
    if (this.reviewer.toString() === this.reviewee.toString()) {
        return next(new Error('Cannot review yourself'));
    }

    next();
});

// Pre-find middleware to exclude soft-deleted reviews
reviewSchema.pre(/^find/, function (next) {
    this.where({ deletedAt: { $exists: false } });
    next();
});

// Instance Methods
reviewSchema.methods.markHelpful = function (userId) {
    const alreadyVoted = this.helpfulBy.some(vote =>
        vote.user.toString() === userId.toString()
    );

    if (alreadyVoted) {
        throw new Error('You have already marked this review as helpful');
    }

    this.helpfulBy.push({ user: userId });
    this.helpfulVotes += 1;
    return this.save();
};

reviewSchema.methods.removeHelpful = function (userId) {
    const voteIndex = this.helpfulBy.findIndex(vote =>
        vote.user.toString() === userId.toString()
    );

    if (voteIndex === -1) {
        throw new Error('You have not marked this review as helpful');
    }

    this.helpfulBy.splice(voteIndex, 1);
    this.helpfulVotes = Math.max(0, this.helpfulVotes - 1);
    return this.save();
};

reviewSchema.methods.addResponse = function (content) {
    this.response = {
        content: content,
        respondedAt: new Date()
    };
    return this.save();
};

reviewSchema.methods.reportReview = function (reporterId, reason, description = '') {
    // Check if user already reported
    const alreadyReported = this.reports.some(report =>
        report.reporter.toString() === reporterId.toString()
    );

    if (alreadyReported) {
        throw new Error('You have already reported this review');
    }

    this.reports.push({
        reporter: reporterId,
        reason: reason,
        description: description
    });

    this.reportCount += 1;
    this.isReported = true;

    // Auto-flag if too many reports
    if (this.reportCount >= 5) {
        this.status = 'flagged';
    }

    return this.save();
};

reviewSchema.methods.softDelete = function (deletedBy) {
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    this.isVisible = false;
    return this.save();
};

// Static Methods
reviewSchema.statics.getAverageRating = function (userId, reviewType = null) {
    const match = { reviewee: userId, status: 'approved', isVisible: true };
    if (reviewType) match.reviewType = reviewType;

    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$overallRating' },
                totalReviews: { $sum: 1 },
                averageCategories: {
                    $avg: {
                        communication: '$categoryRatings.communication',
                        quality: '$categoryRatings.quality',
                        delivery: '$categoryRatings.delivery',
                        professionalism: '$categoryRatings.professionalism',
                        valueForMoney: '$categoryRatings.valueForMoney'
                    }
                }
            }
        }
    ]);
};

reviewSchema.statics.getRatingDistribution = function (userId) {
    return this.aggregate([
        {
            $match: {
                reviewee: userId,
                status: 'approved',
                isVisible: true
            }
        },
        {
            $group: {
                _id: '$overallRating',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: -1 }
        }
    ]);
};

reviewSchema.statics.getRecentReviews = function (userId, limit = 10) {
    return this.find({
        reviewee: userId,
        status: 'approved',
        isVisible: true
    })
        .populate('reviewer', 'userName fullName profileImage')
        .populate('project', 'title')
        .sort({ createdAt: -1 })
        .limit(limit);
};

const Review = mongoose.model('Review', reviewSchema);
export default Review;
