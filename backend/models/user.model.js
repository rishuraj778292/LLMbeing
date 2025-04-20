import { mongoose } from 'mongoose'
const { Schema } = mongoose
import bcrypt from 'bcryptjs'


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
        maxlength: 32,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    fullname: {
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

    // freelancer specific
    skills: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        maxlength: 1000,

    },

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


}, {
    timestamps: true,
}

);
// hash password before saving
userSchema.pre('save', async function (next)  {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()

})

// check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAcessToken = function () {
    return Jwt.sign(
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

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this.id
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }

    )
}

export default user = mongoose.model('user', userSchema);