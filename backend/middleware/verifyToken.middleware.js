import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
const verifyToken = asyncHandler((req,res,next)=>{
        const token = req.cookies[process.env.ACCESS_TOKEN_NAME]
        if(!token) throw new ApiError(401,"No token found");

       try {
         const decode = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
         req.user = decode; // attach user into request
         next();
       } catch (error) {
         throw new ApiError(401,"Token expired")
       }

})

export default verifyToken;