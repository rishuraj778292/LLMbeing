import mongoose  from 'mongoose'
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
    averageRating:{
            type:Number,
            default:0,
    },
    reviewCount:{
        type:Number,
        default:0,
    },
    savedProject:{
        type:[Schema.Types.ObjectId],
        default:[],
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
        remember?
        { expiresIn: process.env.REMEMBER_REFRESH_TOKEN_EXPIRY }
        :
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}
const User = mongoose.model('user', userSchema);
export default User