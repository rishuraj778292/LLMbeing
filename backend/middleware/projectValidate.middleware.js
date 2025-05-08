import { config } from "dotenv";
import User from "../models/user.model.js";
import dotenv from 'dotenv';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator'
dotenv.config()

const verifyAccess = asyncHandler((req, res, next) => {
    const token = req.cookies[process.env.ACCESS_TOKEN_NAME];
    if (!token) throw new ApiError(400, "No access token");
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!user) throw new ApiError(401, "Token expired");
    if (user.role == "client") {
        req.user = user;
        next();
    }
    else {
        throw new ApiError(400, "Permisson denied");
    }

})

const validateProjectdata = asyncHandler((req, res, next) => {
    const projectdata = req.body;
    // title handle
  
    let title = projectdata.title;
    if (!title || title === "") throw new ApiError(400, "Title is required");
    if (title.length < 5) throw new ApiError(400, "Title must be at least 5 characters long");
    if (title.length > 100) throw new ApiError(400, "Title cannot exceed 100 characters ")

    // desription handle
    let description = projectdata.description;
    if (!description || description === "Desription is required") throw new ApiError(400, "")
    if (description.length < 10) throw new ApiError(400, "Description must be at least 5 characters long")

    // price handle 
   let  price = projectdata.price;
    if (!price || price === null) throw new ApiError(400, "Price is required");

    //experienceLevel handle
    let experienceLevel = projectdata.experienceLevel;
    if (!experienceLevel || experienceLevel === "") throw new ApiError(400, "Experience Level is required")

    // projectType handle
    let projectType = projectdata.projectType;
    if (!projectType || projectType === "") throw new ApiError(400, "Project Type is required")

    // skills handle
    let skills = projectdata.skillsRequired
    if (!skills || skills == null) throw new ApiError(400, "skills is required")

    // if everything is fine  then next
    next();

})

export { verifyAccess,validateProjectdata };