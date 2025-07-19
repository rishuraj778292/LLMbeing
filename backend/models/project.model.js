import mongoose from "mongoose";
const { Schema } = mongoose;

// Allowed categories
const project_categories = [
  'ai_chatbots',
  'prompt_engineering',
  'process_automation',
  'api_integration',
  'document_processing',
  'search_analytics',
  'nlp_classification',
  'business_intelligence',
  'data_labeling',
  'research_legal_ai',
  'media_production',
  'voice_technology',
  'translation_localization',
  'generative_design',
  'content_marketing',
  'product_development',
  'edtech_solutions',
  'ai_consulting',
  'security_compliance'
];



const projectSchema = new Schema({
  title: {
    type: String,
    required: [true, "Project title is required"],
    minlength: [5, "Title must be at least 5 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [5000, "Description cannot exceed 5000 characters"]
  },

  // Enhanced Budget Structure
  budget: {
    min: {
      type: Number,
      required: function () { return this.projectType === 'one_time'; }
    },
    max: {
      type: Number,
      required: function () { return this.projectType === 'one_time'; }
    },
    hourlyRate: {
      min: {
        type: Number,
        required: function () { return this.projectType === 'hourly'; }
      },
      max: {
        type: Number,
        required: function () { return this.projectType === 'hourly'; }
      }
    },
    isNegotiable: {
      type: Boolean,
      default: false
    }
  },

  // Accepted budget when project is assigned to freelancer
  acceptedBudget: {
    type: Number
  },

  currency: {
    type: String,
    enum: ["USD", "EUR", "INR", "GBP", "CAD", "AUD"],
    default: "USD"
  },

  // Project Timeline
  timeline: {
    estimatedDuration: {
      value: {
        type: Number
      },
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks', 'months']
      }
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    isFlexible: {
      type: Boolean,
      default: true
    }
  },

  experienceLevel: {
    type: String,
    enum: ['Entry', 'Intermediate', 'Expert'],
    required: [true, "Experience level is required"]
  },

  projectType: {
    type: String,
    enum: ['one_time', 'hourly', 'monthly', 'ongoing'],
    required: [true, "Project Type is required"]
  },

  projectCategory: {
    type: [String],
    required: [true, "Project category is required"],
    enum: project_categories,
    validate: {
      validator: function (categories) {
        return categories.length > 0 && categories.length <= 3;
      },
      message: "Please select 1-3 categories"
    }
  },

  projectStatus: {
    type: String,
    enum: ["draft", "active", "in_progress", "completed", "cancelled", "paused"],
    default: "draft",
    index: true
  },

  skillsRequired: {
    type: [String],
    required: [true, "Skills are required"],
    validate: {
      validator: function (skills) {
        return skills.length > 0 && skills.length <= 10;
      },
      message: "Please select 1-10 skills"
    }
  },

  // Enhanced Project Details
  requirements: {
    description: {
      type: String
    },
    deliverables: [{
      type: String
    }],
    milestones: [{
      title: {
        type: String
      },
      description: {
        type: String
      },
      dueDate: {
        type: Date
      },
      budget: {
        type: Number
      },
      isCompleted: {
        type: Boolean,
        default: false
      }
    }]
  },

  // File Attachments
  attachments: [{
    filename: {
      type: String
    },
    originalName: {
      type: String
    },
    mimetype: {
      type: String
    },
    size: {
      type: Number
    },
    url: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Location & Remote Work
  location: {
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'remote'
    },
    country: {
      type: String
    },
    city: {
      type: String
    },
    timezone: {
      type: String
    }
  },

  // Application Settings
  applicationSettings: {
    maxProposals: {
      type: Number,
      default: 50,
      min: 1,
      max: 100
    },
    autoAcceptProposals: {
      type: Boolean,
      default: false
    },
    allowInvitations: {
      type: Boolean,
      default: true
    },
    screeningQuestions: [{
      question: String,
      required: {
        type: Boolean,
        default: false
      }
    }]
  },

  // Statistics
  stats: {
    viewCount: {
      type: Number,
      default: 0
    },
    proposalCount: {
      type: Number,
      default: 0
    },
    invitationsSent: {
      type: Number,
      default: 0
    },
    shortlistedCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    dislikeCount: {
      type: Number,
      default: 0
    },
    applicationCount: {
      type: Number,
      default: 0
    }
  },

  // User Interactions
  interactions: {
    likes: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      likedAt: {
        type: Date,
        default: Date.now
      }
    }],
    dislikes: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      dislikedAt: {
        type: Date,
        default: Date.now
      }
    }],
    bookmarks: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      bookmarkedAt: {
        type: Date,
        default: Date.now
      }
    }],
    reports: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'fake', 'misleading', 'other'],
        required: true
      },
      description: String,
      reportedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
      }
    }]
  },

  // Legacy fields (for backward compatibility)
  proposal: {
    type: Number,
    default: 0
  },
  interviewing: {
    type: Number,
    default: 0
  },
  invitationSent: {
    type: Number,
    default: 0
  },

  // Relations
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  assignedFreelancer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  // System fields
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  isUrgent: {
    type: Boolean,
    default: false
  },

  slug: {
    type: String,
    unique: true,
    sparse: true
  },

  // SEO & Marketing
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },

  // Audit Trail
  auditLog: [{
    action: String,
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: Schema.Types.Mixed
  }],

  // Soft Delete
  deletedAt: Date,
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Enhanced indexes for performance and scalability
projectSchema.index({ title: 'text', description: 'text' }); // Full-text search
projectSchema.index({ projectCategory: 1, projectStatus: 1 }); // Compound index
projectSchema.index({ experienceLevel: 1, projectType: 1 }); // Compound index
projectSchema.index({ 'budget.min': 1, 'budget.max': 1 }); // Budget range queries
projectSchema.index({ createdAt: -1 }); // Recent projects
projectSchema.index({ 'stats.viewCount': -1 }); // Popular projects
projectSchema.index({ 'stats.likeCount': -1 }); // Most liked projects
projectSchema.index({ client: 1, projectStatus: 1 }); // Client's projects
projectSchema.index({ skillsRequired: 1 }); // Skills-based search
projectSchema.index({ 'location.country': 1, 'location.type': 1 }); // Location-based
projectSchema.index({ isActive: 1, deletedAt: 1 }); // Active projects only
projectSchema.index({ isFeatured: 1, isUrgent: 1 }); // Promoted projects
projectSchema.index({ 'interactions.likes.user': 1 }); // User likes lookup
projectSchema.index({ 'interactions.dislikes.user': 1 }); // User dislikes lookup
projectSchema.index({ 'interactions.bookmarks.user': 1 }); // User bookmarks lookup

// Compound index for complex queries
projectSchema.index({
  projectStatus: 1,
  isActive: 1,
  deletedAt: 1,
  createdAt: -1
});

// Text search index with weights
projectSchema.index(
  {
    title: 'text',
    description: 'text',
    skillsRequired: 'text'
  },
  {
    weights: {
      title: 10,
      skillsRequired: 5,
      description: 1
    }
  }
);


// Enhanced pre-save middleware
projectSchema.pre('save', function (next) {
  // Auto-generate slug if not exists
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();
  }

  // Auto-generate SEO fields
  if (!this.seo.metaTitle && this.title) {
    this.seo.metaTitle = this.title;
  }

  if (!this.seo.metaDescription && this.description) {
    this.seo.metaDescription = this.description.substring(0, 160) + '...';
  }

  next();
});

// Pre-find middleware to exclude soft-deleted documents
projectSchema.pre(/^find/, function (next) {
  this.where({ deletedAt: { $exists: false } });
  next();
});

// Virtual for project URL
projectSchema.virtual('url').get(function () {
  return `/projects/${this.slug}`;
});

// Virtual for budget display
projectSchema.virtual('budgetDisplay').get(function () {
  if (this.projectType === 'hourly' && this.budget.hourlyRate) {
    return `$${this.budget.hourlyRate.min}-${this.budget.hourlyRate.max}/hr`;
  } else if (this.budget.min && this.budget.max) {
    return `$${this.budget.min}-${this.budget.max}`;
  }
  return 'Budget not specified';
});

// Instance method for soft delete
projectSchema.methods.softDelete = function (deletedBy) {
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  this.isActive = false;
  return this.save();
};

// Instance method to add audit log
projectSchema.methods.addAuditLog = function (action, performedBy, details = {}) {
  this.auditLog.push({
    action,
    performedBy,
    details
  });
  return this.save();
};

// Instance methods for like/dislike functionality
projectSchema.methods.toggleLike = function (userId) {
  const userLiked = this.interactions.likes.find(like => like.user.toString() === userId.toString());
  const userDisliked = this.interactions.dislikes.find(dislike => dislike.user.toString() === userId.toString());

  // Remove dislike if exists
  if (userDisliked) {
    this.interactions.dislikes.pull({ _id: userDisliked._id });
    this.stats.dislikeCount = Math.max(0, this.stats.dislikeCount - 1);
  }

  // Toggle like
  if (userLiked) {
    // Remove like
    this.interactions.likes.pull({ _id: userLiked._id });
    this.stats.likeCount = Math.max(0, this.stats.likeCount - 1);
    return { action: 'unliked', likeCount: this.stats.likeCount, dislikeCount: this.stats.dislikeCount };
  } else {
    // Add like
    this.interactions.likes.push({ user: userId });
    this.stats.likeCount += 1;
    return { action: 'liked', likeCount: this.stats.likeCount, dislikeCount: this.stats.dislikeCount };
  }
};

projectSchema.methods.toggleDislike = function (userId) {
  const userLiked = this.interactions.likes.find(like => like.user.toString() === userId.toString());
  const userDisliked = this.interactions.dislikes.find(dislike => dislike.user.toString() === userId.toString());

  // Remove like if exists
  if (userLiked) {
    this.interactions.likes.pull({ _id: userLiked._id });
    this.stats.likeCount = Math.max(0, this.stats.likeCount - 1);
  }

  // Toggle dislike
  if (userDisliked) {
    // Remove dislike
    this.interactions.dislikes.pull({ _id: userDisliked._id });
    this.stats.dislikeCount = Math.max(0, this.stats.dislikeCount - 1);
    return { action: 'undisliked', likeCount: this.stats.likeCount, dislikeCount: this.stats.dislikeCount };
  } else {
    // Add dislike
    this.interactions.dislikes.push({ user: userId });
    this.stats.dislikeCount += 1;
    return { action: 'disliked', likeCount: this.stats.likeCount, dislikeCount: this.stats.dislikeCount };
  }
};

projectSchema.methods.toggleBookmark = function (userId) {
  const userBookmarked = this.interactions.bookmarks.find(bookmark => bookmark.user.toString() === userId.toString());

  if (userBookmarked) {
    // Remove bookmark
    this.interactions.bookmarks.pull({ _id: userBookmarked._id });
    return { action: 'unbookmarked' };
  } else {
    // Add bookmark
    this.interactions.bookmarks.push({ user: userId });
    return { action: 'bookmarked' };
  }
};

projectSchema.methods.addReport = function (userId, reason, description = '') {
  // Check if user already reported this project
  const existingReport = this.interactions.reports.find(report =>
    report.user.toString() === userId.toString() && report.status === 'pending'
  );

  if (existingReport) {
    throw new Error('You have already reported this project');
  }

  this.interactions.reports.push({
    user: userId,
    reason,
    description
  });

  return this.save();
};

projectSchema.methods.getUserInteraction = function (userId) {
  const liked = this.interactions.likes.some(like => like.user.toString() === userId.toString());
  const disliked = this.interactions.dislikes.some(dislike => dislike.user.toString() === userId.toString());
  const bookmarked = this.interactions.bookmarks.some(bookmark => bookmark.user.toString() === userId.toString());

  return {
    liked,
    disliked,
    bookmarked,
    likeCount: this.stats.likeCount,
    dislikeCount: this.stats.dislikeCount
  };
};

// Static method for advanced search
projectSchema.statics.advancedSearch = function (filters) {
  const query = {};

  if (filters.keyword) {
    query.$text = { $search: filters.keyword };
  }

  if (filters.categories && filters.categories.length > 0) {
    query.projectCategory = { $in: filters.categories };
  }

  if (filters.skills && filters.skills.length > 0) {
    query.skillsRequired = { $in: filters.skills };
  }

  if (filters.experienceLevel) {
    query.experienceLevel = filters.experienceLevel;
  }

  if (filters.projectType) {
    query.projectType = filters.projectType;
  }

  if (filters.budgetMin || filters.budgetMax) {
    query['budget.min'] = {};
    if (filters.budgetMin) query['budget.min'].$gte = filters.budgetMin;
    if (filters.budgetMax) query['budget.max'].$lte = filters.budgetMax;
  }

  if (filters.location) {
    query['location.type'] = filters.location;
  }

  // Always filter active, non-deleted projects
  query.isActive = true;
  query.projectStatus = { $in: ['active', 'in_progress'] };

  return this.find(query);
};

// Static method to get trending projects
projectSchema.statics.getTrendingProjects = function (days = 7, limit = 10) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);

  return this.aggregate([
    {
      $match: {
        isActive: true,
        projectStatus: { $in: ['active', 'in_progress'] },
        createdAt: { $gte: dateThreshold },
        deletedAt: { $exists: false }
      }
    },
    {
      $addFields: {
        trendingScore: {
          $add: [
            { $multiply: ['$stats.likeCount', 3] }, // Likes worth 3 points
            { $multiply: ['$stats.viewCount', 0.1] }, // Views worth 0.1 points
            { $multiply: ['$stats.proposalCount', 2] }, // Proposals worth 2 points
            { $subtract: [0, { $multiply: ['$stats.dislikeCount', 1] }] } // Dislikes subtract 1 point
          ]
        }
      }
    },
    {
      $sort: { trendingScore: -1, createdAt: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

// Static method to get most liked projects
projectSchema.statics.getMostLikedProjects = function (limit = 10) {
  return this.find({
    isActive: true,
    projectStatus: { $in: ['active', 'in_progress'] },
    'stats.likeCount': { $gt: 0 }
  })
    .sort({ 'stats.likeCount': -1, createdAt: -1 })
    .limit(limit);
};

// Static method to get user's liked projects
projectSchema.statics.getUserLikedProjects = function (userId, limit = 20) {
  return this.find({
    'interactions.likes.user': userId,
    isActive: true
  })
    .sort({ 'interactions.likes.likedAt': -1 })
    .limit(limit);
};

// Static method to get user's bookmarked projects
projectSchema.statics.getUserBookmarkedProjects = function (userId, limit = 20) {
  return this.find({
    'interactions.bookmarks.user': userId,
    isActive: true
  })
    .sort({ 'interactions.bookmarks.bookmarkedAt': -1 })
    .limit(limit);
};

const Project = mongoose.model("Project", projectSchema);
export default Project;
