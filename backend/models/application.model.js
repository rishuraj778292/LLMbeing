import mongoose, { Types } from "mongoose";
import Project from "./project.model.js";
import User from './user.model.js'
const {Schema} = mongoose;

const applicationSchema = mongoose.Schema({
        client:{
                type:Schema.Types.ObjectId,
                ref:User,
        },
        applicant:{
                type:Schema.Types.ObjectId,
                ref:User,
        },
        project_id:{
                type:Schema.Types.ObjectId,
                ref:Project,
        },
        desciption:{
                type:String,
                default:"",
        },
        createdAt:{
                type:Date,
                deafult:Date.now,
        },
        status:{
                type:String,
                enum:['pending','accepted','rejected'],
                default:'pending',
        },
        
})

const application = mongoose.model("application",applicationSchema);
export default application;