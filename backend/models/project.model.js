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
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
    minlength: [10, "Description must be at least 10 characters long"]
  },
  budget: {
    type: String,
    enum: ['0k to 10k', '10k to 20k', '20k to 30k', '30k-40k', '40k-50k', 'Above 50k'],
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "INR"],
    default: "INR"
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert'],
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
  },
  projectStatus: {
    type: String,
    enum: ["completed", "pending", "interviewing"],
    default: "pending"
  },
  skillsRequired: {
    type: [String],
    required: [true, "Skills are required"]
  },
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
  client: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Indexes for performance
projectSchema.index({ title: 'text', description: 'text' }); // For search
projectSchema.index({ projectCategory: 1 });
projectSchema.index({ experienceLevel: 1 });
projectSchema.index({ projectType: 1 });
projectSchema.index({ projectStatues: 1 });


// Optional: Auto-generate slug before saving
projectSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
