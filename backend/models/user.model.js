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

    // OTP verification fields
    emailOTP: {
        type: String,
        default: null,
    },
    emailOTPExpires: {
        type: Date,
        default: null,
    },
    passwordResetOTP: {
        type: String,
        default: null,
    },
    passwordResetOTPExpires: {
        type: Date,
        default: null,
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


    // project activity
    savedProjects: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },
    likedProjects: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },
    dislikedProjects: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },

    appliedProjects: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },
    activeProjects: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },
    completedProjects: {
        type: [Schema.Types.ObjectId],
        ref: 'Project',
        default: [],
    }



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

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateRefreshToken = function (remember) {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        remember ?
            { expiresIn: process.env.REMEMBER_REFRESH_TOKEN_EXPIRY }
            :
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = jwt.sign(
        { _id: this._id, purpose: 'password-reset' },
        process.env.RESET_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET, // Use dedicated secret or fallback
        { expiresIn: '10m' } // 10 minutes expiration
    );

    // Store the token in database for verification
    this.resetPasswordToken = resetToken;

    return resetToken;
}

// Generate email verification OTP
userSchema.methods.generateEmailOTP = function () {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (10 minutes)
    this.emailOTP = otp;
    this.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

    return otp;
}

// Generate password reset OTP
userSchema.methods.generatePasswordResetOTP = function () {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (10 minutes)
    this.passwordResetOTP = otp;
    this.passwordResetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

    return otp;
}

// Verify email OTP
userSchema.methods.verifyEmailOTP = function (otp) {
    if (!this.emailOTP || !this.emailOTPExpires) {
        return false;
    }

    if (this.emailOTPExpires < new Date()) {
        // OTP expired
        this.emailOTP = null;
        this.emailOTPExpires = null;
        return false;
    }

    if (this.emailOTP === otp) {
        // OTP is valid, clear it and mark email as verified
        this.emailOTP = null;
        this.emailOTPExpires = null;
        this.isEmailVerified = true;
        return true;
    }

    return false;
}

// Verify password reset OTP
userSchema.methods.verifyPasswordResetOTP = function (otp) {
    if (!this.passwordResetOTP || !this.passwordResetOTPExpires) {
        return false;
    }

    if (this.passwordResetOTPExpires < new Date()) {
        // OTP expired
        this.passwordResetOTP = null;
        this.passwordResetOTPExpires = null;
        return false;
    }

    if (this.passwordResetOTP === otp) {
        // OTP is valid, clear it
        this.passwordResetOTP = null;
        this.passwordResetOTPExpires = null;
        return true;
    }

    return false;
}

// Verify password reset token
userSchema.statics.findByResetToken = function (token) {
    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET);

        // Find user with matching token and ensure it's for password reset
        return this.findOne({
            _id: decoded._id,
            resetPasswordToken: token
        });
    } catch (error) {
        // Token is invalid or expired
        return null;
    }
}
const User = mongoose.model('user', userSchema);
export default User