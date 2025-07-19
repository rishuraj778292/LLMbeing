import mongoose from "mongoose";
const { Schema } = mongoose;
const bidSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})