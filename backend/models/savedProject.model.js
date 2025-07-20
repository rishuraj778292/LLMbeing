import mongoose from "mongoose";
const { Schema } = mongoose;

const savedProjectSchema = new Schema({
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

// Unique constraint: One save per user per project
savedProjectSchema.index({ user: 1, project: 1 }, { unique: true });

// Index for finding user's saved projects
savedProjectSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to add to user's saved projects array
savedProjectSchema.pre('save', async function (next) {
    if (this.isNew) {
        const User = mongoose.model('User');

        // Add to user's saved projects array
        await User.findByIdAndUpdate(this.user, {
            $addToSet: { savedProjects: this.project }
        });
    }
    next();
});

// Post-remove middleware to remove from user's saved projects array
savedProjectSchema.post('deleteOne', { document: true, query: false }, async function () {
    const User = mongoose.model('User');

    // Remove from user's saved projects array
    await User.findByIdAndUpdate(this.user, {
        $pull: { savedProjects: this.project }
    });
});

// Static method to toggle save
savedProjectSchema.statics.toggleSave = async function (userId, projectId) {
    try {
        const existing = await this.findOne({
            user: userId,
            project: projectId
        });

        if (existing) {
            await existing.deleteOne();
            return { action: 'unsaved', message: 'Project removed from saved list' };
        } else {
            await this.create({
                user: userId,
                project: projectId
            });
            return { action: 'saved', message: 'Project saved successfully' };
        }
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project already saved by this user');
        }
        throw error;
    }
};

// Static method to get user's saved projects
savedProjectSchema.statics.getUserSavedProjects = function (userId, options = {}) {
    const { limit = 20, page = 1 } = options;

    return this.find({ user: userId })
        .populate({
            path: 'project',
            match: { isActive: true },
            populate: {
                path: 'client',
                select: 'userName fullName profileImage averageRating'
            }
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
};

const SavedProject = mongoose.model('SavedProject', savedProjectSchema);
export default SavedProject;