import mongoose from 'mongoose'
const { Schema } = mongoose
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Invalid email format'],
        index: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['freelancer', 'client', 'admin'],
        required: true,
    },
    profileImage: {

        type: String,
        default: '',
    },

    // Professional Information
    skills: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        maxlength: 1000,
    },
    professionalTitle: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    hourlyRate: {
        type: Number,
        min: 0,
    },

    // Contact Information
    phone: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },

    // Social Links
    github: {
        type: String,
        trim: true,
    },
    linkedin: {
        type: String,
        trim: true,
    },
    twitter: {
        type: String,
        trim: true,
    },

    // Languages
    languages: [{
        name: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: ['Native', 'Fluent', 'Conversational', 'Basic'],
            required: true,
        }
    }],

    // Experience
    experience: [{
        jobTitle: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        current: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            maxlength: 1000,
        }
    }],

    // Education
    education: [{
        degree: {
            type: String,
            required: true,
        },
        institution: {
            type: String,
            required: true,
        },
        startYear: {
            type: Number,
            required: true,
        },
        endYear: {
            type: Number,
        },
        grade: {
            type: String,
        }
    }],

    // Certifications
    certifications: [{
        name: {
            type: String,
            required: true,
        },
        issuer: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        credentialId: {
            type: String,
        },
        credentialUrl: {
            type: String,
        }
    }],

    // Portfolio/Projects
    portfolio: [{
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        technologies: [String],
        projectUrl: {
            type: String,
        },
        githubUrl: {
            type: String,
        },
        images: [String],
        category: {
            type: String,
            enum: ['Client Project', 'Personal Project', 'Open Source', 'Freelance Work'],
            default: 'Personal Project',
        },
        completedDate: {
            type: Date,
        }
    }],

    // client specific
    accountType: {
        type: String,
        enum: ['individual', 'company'],
    },
    companyName: {
        type: String,
        trim: true,
    },
    companyCategory: {
        type: String,
        trim: true,
    },

    // Verification status
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    isProfileVerified: {
        type: Boolean,
        default: false,
    },

    // Statistics
    totalEarnings: {
        type: Number,
        default: 0,
    },
    completedProjects: {
        type: Number,
        default: 0,
    },
    successRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },

    // common meta fields
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    savedProject: {
        type: [Schema.Types.ObjectId],
        default: [],
    },


}, {
    timestamps: true,
}

);
// hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()

})

// check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAcessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateRefreshToken = function (remember) {
    return jwt.sign({
        _id: this.id
    },
        process.env.REFRESH_TOKEN_SECRET,
        remember ?
            { expiresIn: process.env.REMEMBER_REFRESH_TOKEN_EXPIRY }
            :
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}
const User = mongoose.model('user', userSchema);
export default User