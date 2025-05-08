import { asyncHandler } from '../utils/asyncHandler.js'
import User from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'
import { cookie } from 'express-validator';
import { response } from 'express';
import dotenv from 'dotenv'
dotenv.config()

// register
const register = asyncHandler(async (req, res) => {

     const newUser = await User.create(req.body);

     // convert the mongoose document to a plain object and include some sensitive file
     const userResponse = newUser.toObject();
     delete userResponse.password;
     delete userResponse.refreshToken;
     delete userResponse.resetPasswordToken;
     res.status(200).send(new ApiResponse(200, userResponse, "User registered successfully"));
})


// login 
const login = asyncHandler(async (req, res) => {
     // steps
     // req body -> data
     // username or email
     // find the user
     // password check
     // acess and refresh token
     console.log(req.body);
     const userData = req.body;
     const emailOrUserName = userData.emailOrUserName;
     const password = userData.password;
     const remember = userData.remember;
     console.log(emailOrUserName)

     // finging user
     const user = await User.findOne({
          $or: [
               { email: emailOrUserName },
               { userName: emailOrUserName }
          ]
     })

     if (!user) throw new ApiError(400, "User not found")


     const isPasswordCorrect = await user.isPasswordCorrect(password)

     if (!isPasswordCorrect) throw new ApiError(400, "Invalid Password")


     // generate access token
     const accessToken = user.generateAcessToken();

     // generate acess token
     const refreshToken = user.generateRefreshToken(remember);



     user.refreshToken = refreshToken;
     await user.save({ validateBeforeSave: false })
     
     // remove the data which is  not secure to send in frontend
     const response = user.toObject();
     delete response.password;
     delete response.refreshToken;
     delete response.resetPasswordToken;
     

     res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict"
     })
     res.cookie(process.env.ACCESS_TOKEN_NAME, accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict"
     })
     res.status(200).json(new ApiResponse(
          200,
          {
               response
          },
          "Login succefully"
     ))


})


const logoutUser = asyncHandler(async(req,res)=>{
     console.log("recieved")
      res.clearCookie(process.env.ACCESS_TOKEN_NAME,{
          httpOnly:true,
          sameSite:"strict",
          secure:true,
      });
      res.clearCookie(process.env.REFRESH_TOKEN_NAME,{
          httpOnly:true,
          sameSite:"strict",
          secure:true,
      })
      res.status(200).send(new ApiResponse(200,{},"logout successfully"))
})

// verify fro login

const verifyUser = asyncHandler(async (req, res) => {
     const user = await User.findById(req.user._id).select("-password -refreshToken -resetPasswordToken")

     if (!user) throw new ApiError(401, "User Not found")

     res.json(new ApiResponse(
          200,
          {
               user
          }
     ))

})

const refreshtoken = asyncHandler(async (req, res) => {
     console.log("refresh token called")
     const token = req.cookies[process.env.REFRESH_TOKEN_NAME]
     if (!token) throw new ApiError(401, "No refresh token");

     const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
     if (!decode) throw new ApiError(401, "Invalid refresh token")
     const user = await User.findById(decode._id).select("-password -acessToken -resetToken");
     if (!user) throw new ApiError(401, "User not found")
     const accessToken = user.generateAcessToken();
     res.cookie(process.env.ACCESS_TOKEN_NAME, accessToken, {
          secure: true,
          httpOnly: true,
     }).json(new ApiResponse(200, user, "token refreshed sucessfully"))
})

export { register, login, verifyUser, refreshtoken,logoutUser }