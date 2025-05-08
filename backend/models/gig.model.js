import mongoose from "mongoose";
import User from "./user.model.js";
const {Schema}=mongoose;
const gigSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    coverImage: {
        type: String,
        default: "",
    },
    freelancer: {
        type: Schema.Types.ObjectId,
        ref: "User"

    }
  
}, {
    timestamps: true,
})

const Gig = mongoose.model("gig", gigSchema);
export default Gig;