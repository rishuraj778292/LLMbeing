import mongoose from "mongoose";
const { Schema } = mongoose;

const dislikedProjectSchema = new Schema({
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

// Unique constraint: One dislike per user per project
dislikedProjectSchema.index({ user: 1, project: 1 }, { unique: true });

// Index for finding project's dislikers
dislikedProjectSchema.index({ project: 1, createdAt: -1 });

// Index for finding user's disliked projects
dislikedProjectSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to update project dislike count and user's disliked projects array
dislikedProjectSchema.pre('save', async function (next) {
    if (this.isNew) {
        const Project = mongoose.model('Project');
        const User = mongoose.model('User');

        // Increase dislike count in project
        await Project.findByIdAndUpdate(this.project, {
            $inc: { 'stats.dislikeCount': 1 }
        });

        // Add to user's disliked projects array
        await User.findByIdAndUpdate(this.user, {
            $addToSet: { dislikedProjects: this.project }
        });
    }
    next();
});

// Post-remove middleware to update counts when dislike is removed
dislikedProjectSchema.post('deleteOne', { document: true, query: false }, async function () {
    const Project = mongoose.model('Project');
    const User = mongoose.model('User');

    // Decrease dislike count in project
    await Project.findByIdAndUpdate(this.project, {
        $inc: { 'stats.dislikeCount': -1 }
    });

    // Remove from user's disliked projects array
    await User.findByIdAndUpdate(this.user, {
        $pull: { dislikedProjects: this.project }
    });
});

// Static method to toggle dislike
dislikedProjectSchema.statics.toggleDislike = async function (userId, projectId) {
    try {
        const existing = await this.findOne({
            user: userId,
            project: projectId
        });

        if (existing) {
            await existing.deleteOne();
            return { action: 'undisliked', message: 'Project dislike removed successfully' };
        } else {
            await this.create({
                user: userId,
                project: projectId
            });
            return { action: 'disliked', message: 'Project disliked successfully' };
        }
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project already disliked by this user');
        }
        throw error;
    }
};

// Static method to get project dislikers
dislikedProjectSchema.statics.getProjectDislikers = function (projectId, options = {}) {
    const { limit = 50, page = 1 } = options;

    return this.find({ project: projectId })
        .populate('user', 'userName fullName profileImage averageRating')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
};

const DislikedProject = mongoose.model('DislikedProject', dislikedProjectSchema);
export default DislikedProject;
