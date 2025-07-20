import mongoose from "mongoose";
const { Schema } = mongoose;

const packageSchema = new Schema({
    name: {
        type: String,
        required: [true, "Package name is required"],
        enum: ['Basic', 'Standard', 'Premium']
    },
    description: {
        type: String,
        required: [true, "Package description is required"]
    },
    price: {
        type: Number,
        required: [true, "Package price is required"],
        min: [1, "Price must be at least $1"]
    },
    deliveryTime: {
        type: Number,
        required: [true, "Delivery time is required"],
        min: [1, "Delivery time must be at least 1 day"]
    },
    features: [{
        type: String,
        required: true
    }],
    revisions: {
        type: Number,
        default: 1,
        min: [0, "Revisions cannot be negative"]
    }
});

const gigSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [10, "Title must be at least 10 characters"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [50, "Description must be at least 50 characters"],
        maxlength: [5000, "Description cannot exceed 5000 characters"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: [
            'machine_learning',
            'natural_language_processing',
            'computer_vision',
            'data_science',
            'web_development',
            'mobile_development',
            'blockchain',
            'cloud_computing',
            'automation',
            'ai_integration',
            'database',
            'ui_ux',
            'cybersecurity',
            'game_development',
            'iot'
        ]
    },
    skills: [{
        type: String,
        required: true,
        trim: true
    }],
    price: {
        type: Number,
        required: [true, "Starting price is required"],
        min: [1, "Price must be at least $1"]
    },
    deliveryTime: {
        type: Number,
        required: [true, "Delivery time is required"],
        min: [1, "Delivery time must be at least 1 day"]
    },
    packages: [packageSchema],
    coverImage: {
        type: String,
        default: ""
    },
    galleryImages: [{
        type: String
    }],
    freelancer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Freelancer reference is required"],
        index: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'inactive'],
        default: 'active'
    },
    orders: {
        type: Number,
        default: 0,
        min: [0, "Orders cannot be negative"]
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be negative"],
            max: [5, "Rating cannot exceed 5"]
        },
        count: {
            type: Number,
            default: 0,
            min: [0, "Rating count cannot be negative"]
        }
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    faq: [{
        question: {
            type: String,
            required: true,
            trim: true
        },
        answer: {
            type: String,
            required: true,
            trim: true
        }
    }],
    requirements: [{
        type: String,
        trim: true
    }],
    views: {
        type: Number,
        default: 0,
        min: [0, "Views cannot be negative"]
    },
    impressions: {
        type: Number,
        default: 0,
        min: [0, "Impressions cannot be negative"]
    },
    clicks: {
        type: Number,
        default: 0,
        min: [0, "Clicks cannot be negative"]
    }
}, {
    timestamps: true,
});

// Indexes for better performance
gigSchema.index({ freelancer: 1, status: 1 });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ skills: 1, status: 1 });
gigSchema.index({ price: 1, status: 1 });
gigSchema.index({ 'rating.average': -1, status: 1 });
gigSchema.index({ orders: -1, status: 1 });
gigSchema.index({ createdAt: -1 });

// Text index for search functionality
gigSchema.index({
    title: 'text',
    description: 'text',
    skills: 'text',
    tags: 'text'
});

// Virtual for calculating conversion rate
gigSchema.virtual('conversionRate').get(function() {
    if (this.impressions === 0) return 0;
    return (this.clicks / this.impressions) * 100;
});

// Virtual for calculating click-through rate
gigSchema.virtual('clickThroughRate').get(function() {
    if (this.views === 0) return 0;
    return (this.clicks / this.views) * 100;
});

// Pre-save middleware to validate freelancer role
gigSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('freelancer')) {
        const User = mongoose.model('User');
        const freelancer = await User.findById(this.freelancer);
        
        if (!freelancer) {
            throw new Error('Freelancer not found');
        }
        
        if (freelancer.role !== 'freelancer') {
            throw new Error('Only freelancers can create gigs');
        }
    }
    next();
});

// Pre-save middleware to ensure at least one package exists
gigSchema.pre('save', function(next) {
    if (this.packages.length === 0) {
        // Create a basic package if none exists
        this.packages.push({
            name: 'Basic',
            description: 'Basic package',
            price: this.price,
            deliveryTime: this.deliveryTime,
            features: ['Standard delivery'],
            revisions: 1
        });
    }
    next();
});

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;