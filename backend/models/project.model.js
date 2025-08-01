import mongoose from "mongoose";
import contentFilter from "../utils/contentFilter.js";
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

  currency: {
    type: String,
    enum: ["USD", "EUR", "INR", "GBP", "CAD", "AUD"],
    default: "INR"
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
    default: "active",
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
  },

  // User Interactions
  interactions: {
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
    default: true
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
projectSchema.index({ isActive: 1 }); // Active projects only
projectSchema.index({ isFeatured: 1, isUrgent: 1 }); // Promoted projects

// Compound index for complex queries
projectSchema.index({
  projectStatus: 1,
  isActive: 1,
  createdAt: -1
});// Text search index with weights
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
  // Content validation for inappropriate content
  const validation = contentFilter.validateProject(this.toObject());

  if (!validation.isValid) {
    const error = new Error('Project contains inappropriate content that violates our community guidelines. Please review and modify your content to ensure it\'s professional and appropriate.');
    error.name = 'ValidationError';
    error.details = validation.violatedFields;
    return next(error);
  }

  // Auto-generate slug if not exists
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();
  }

  next();
});

// Pre-find middleware - removed deletedAt filter since we removed soft delete
projectSchema.pre(/^find/, function (next) {
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

// Instance method for deactivating project
projectSchema.methods.deactivate = function () {
  this.isActive = false;
  return this.save();
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
        createdAt: { $gte: dateThreshold }
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

const Project = mongoose.model("Project", projectSchema);
export default Project;
