import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

const verifyAccess = asyncHandler(async(req,res,next)=>{
                const token = req.cookies[process.env.ACCESS_TOKEN_NAME];
                if(!token) throw new ApiError(400,"acess token not recieved");
                const decode = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
                if(!decode)  throw new ApiError(401,"Token expired");
                if(decode.role==="freelancer"){
                     next();
                }
                else{
                    throw new ApiError(400,"permisson denied");
                }
})

const verifyData = asyncHandler((req,res,next)=>{
        const gigdata = req.body;
        let title = gigdata.title;
        if(!title) throw new ApiError(400,"title is required");

        let description = gigdata.description;
        if(!description) throw new ApiError(400,"description is required");
        next();
})

export {verifyAccess,verifyData}