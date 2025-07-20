import mongoose from "mongoose";
const { Schema } = mongoose;

const likedProjectSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User reference is required"],
        index: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Project reference is required"],
        index: true
    }
}, {
    timestamps: true
});

// Unique constraint: One like per user per project
likedProjectSchema.index({ user: 1, project: 1 }, { unique: true });

// Index for finding project's likers
likedProjectSchema.index({ project: 1, createdAt: -1 });

// Index for finding user's liked projects
likedProjectSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to update project like count and user's liked projects array
likedProjectSchema.pre('save', async function (next) {
    if (this.isNew) {
        const Project = mongoose.model('Project');
        const User = mongoose.model('User');

        // Increase like count in project
        await Project.findByIdAndUpdate(this.project, {
            $inc: { 'stats.likeCount': 1 }
        });

        // Add to user's liked projects array
        await User.findByIdAndUpdate(this.user, {
            $addToSet: { likedProjects: this.project }
        });
    }
    next();
});

// Post-remove middleware to update counts when like is removed
likedProjectSchema.post('deleteOne', { document: true, query: false }, async function () {
    const Project = mongoose.model('Project');
    const User = mongoose.model('User');

    // Decrease like count in project
    await Project.findByIdAndUpdate(this.project, {
        $inc: { 'stats.likeCount': -1 }
    });

    // Remove from user's liked projects array
    await User.findByIdAndUpdate(this.user, {
        $pull: { likedProjects: this.project }
    });
});

// Static method to toggle like
likedProjectSchema.statics.toggleLike = async function (userId, projectId) {
    try {
        const existing = await this.findOne({
            user: userId,
            project: projectId
        });

        if (existing) {
            await existing.deleteOne();
            return { action: 'unliked', message: 'Project unliked successfully' };
        } else {
            await this.create({
                user: userId,
                project: projectId
            });
            return { action: 'liked', message: 'Project liked successfully' };
        }
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project already liked by this user');
        }
        throw error;
    }
};

// Static method to get project likers
likedProjectSchema.statics.getProjectLikers = function (projectId, options = {}) {
    const { limit = 50, page = 1 } = options;

    return this.find({ project: projectId })
        .populate('user', 'userName fullName profileImage averageRating')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
};

const LikedProject = mongoose.model('LikedProject', likedProjectSchema);
export default LikedProject;
