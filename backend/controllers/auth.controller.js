import { asyncHandler } from '../utils/asyncHandler.js'
import User from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from  'jsonwebtoken'


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

     if(!user) throw new ApiError(401,"User not found")
     console.log(user)
     
     const  isPasswordCorrect = await user.isPasswordCorrect(password)
     
     if(!isPasswordCorrect) throw new ApiError(400,"Invalid Password")


     // generate access token
     const accessToken = user.generateAcessToken();

     // generate acess token
     const refreshToken = user.generateRefreshToken(remember);

     

     user.refreshToken = refreshToken;
     await user.save({validateBeforesave:false})
     
     // remove the data which is  not secure to send in frontend
     const response = user.toObject();
     delete response.password;
     delete response.refreshToken;
     delete response.resetPasswordToken;

     res.status(200)
     .cookie("refreshToken",refreshToken,"accessToken" ,accessToken,{
          httpOnly:true,
          secure:true,
          sameSite:"strict"
     })
     .json(new ApiResponse(
          200,
          {
               response
          },
          "Login succefully"
     ))


})

export { register, login }