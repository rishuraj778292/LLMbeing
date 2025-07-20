import mongoose from "mongoose";
const { schema } = mongoose();
import Project from "./project.model.js"
import User from "./user.model.js";

const savedProjectSchema = new schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    savedAt: {
        type: Date,
        default: Date.now(),
    },

}, {
    timestamp: true,
});

export default savedProjectSchema;