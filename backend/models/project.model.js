import mongoose from "mongoose";
import User from "./user.model.js";
const { Schema } = mongoose;

// Allowed categories
const allowedCategories = [
  "AI Agents (Chatbots, GPT bots)",
  "Automation (Make.com, Zapier)",
  "LLM Apps (OpenAI, Claude, Gemini)",
  "API Integrations",
  "Prompt Engineering",
  "Data Labeling & Analytics"
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
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
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
    enum: ['one_time', 'hourly', 'monthly'],
    required: [true, "Project Type is required"]
  },
  projectCategory: {
    type: [String],
    required: [true, "Project category is required"],
    validate: {
      validator: (val) => val.every(cat => allowedCategories.includes(cat)),
      message: "Invalid project category"
    }
  },
  projectStatus: {
    type: String,
    enum: ["completed", "pending"],
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
    ref: User,
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
projectSchema.pre('save', function(next) {
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
