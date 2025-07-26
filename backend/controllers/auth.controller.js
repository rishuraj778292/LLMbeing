import { asyncHandler } from '../utils/asyncHandler.js'
import User from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { sendEmail, createPasswordResetEmail, createEmailVerificationOTP, createPasswordResetOTP } from '../utils/emailService.js'
dotenv.config()

// register
const register = asyncHandler(async (req, res) => {
     // checking for duplicate user
     const email  = req.body.email;
     const userExists = await User.findOne({email:email});
     if(userExists) throw new ApiError(500,"User allready registered")
     // Create user but don't mark as verified yet
     const newUser = await User.create(req.body);

     // Generate email verification OTP
     const otp = newUser.generateEmailOTP();

     // Save user with OTP
     await newUser.save({ validateBeforeSave: false });

     try {
          // Create email content
          const { message, html } = createEmailVerificationOTP(otp, newUser.fullName);

          // Send OTP email
          const emailResult = await sendEmail({
               to: newUser.email,
               subject: 'Verify Your Email - LLMbeing Registration',
               message,
               html
          });

          // Prepare response data (don't include user data until verified)
          const responseData = {
               email: newUser.email,
               message: "Registration successful! Please check your email for OTP verification."
          };

          // In development, include preview URL for testing
          if (process.env.NODE_ENV === 'development' && emailResult.previewUrl) {
               responseData.previewUrl = emailResult.previewUrl;
               responseData.messageId = emailResult.messageId;
          }

          res.status(200).json(new ApiResponse(
               200,
               responseData,
               "Registration successful! Please verify your email with the OTP sent to your email address."
          ));

     } catch (error) {
          // If email fails, delete the user
          await User.findByIdAndDelete(newUser._id);
          throw new ApiError(500, "Error sending verification email. Please try again.");
     }
})

// Verify Email OTP
const verifyEmailOTP = asyncHandler(async (req, res) => {
     const { email, otp } = req.body;

     if (!email || !otp) {
          throw new ApiError(400, "Email and OTP are required");
     }

     // Find user by email
     const user = await User.findOne({ email: email.toLowerCase() });
     if (!user) {
          throw new ApiError(404, "User not found");
     }

     // Check if already verified
     if (user.isEmailVerified) {
          throw new ApiError(400, "Email is already verified");
     }

     // Verify OTP
     const isOTPValid = user.verifyEmailOTP(otp);
     if (!isOTPValid) {
          throw new ApiError(400, "Invalid or expired OTP");
     }

     // Save user with verified status
     await user.save({ validateBeforeSave: false });

     // Remove sensitive data
     const userResponse = user.toObject();
     delete userResponse.password;
     delete userResponse.refreshToken;
     delete userResponse.resetPasswordToken;
     delete userResponse.emailOTP;
     delete userResponse.emailOTPExpires;

     res.status(200).json(new ApiResponse(
          200,
          userResponse,
          "Email verified successfully! Registration completed."
     ));
})

// Resend Email OTP
const resendEmailOTP = asyncHandler(async (req, res) => {
     const { email } = req.body;

     if (!email) {
          throw new ApiError(400, "Email is required");
     }

     // Find user by email
     const user = await User.findOne({ email: email.toLowerCase() });
     if (!user) {
          throw new ApiError(404, "User not found");
     }

     // Check if already verified
     if (user.isEmailVerified) {
          throw new ApiError(400, "Email is already verified");
     }

     // Generate new OTP
     const otp = user.generateEmailOTP();

     // Save user with new OTP
     await user.save({ validateBeforeSave: false });

     try {
          // Create email content
          const { message, html } = createEmailVerificationOTP(otp, user.fullName);

          // Send OTP email
          const emailResult = await sendEmail({
               to: user.email,
               subject: 'Verify Your Email - LLMbeing Registration',
               message,
               html
          });

          // Prepare response data
          const responseData = {
               email: user.email,
               message: "New OTP sent successfully!"
          };

          // In development, include preview URL for testing
          if (process.env.NODE_ENV === 'development' && emailResult.previewUrl) {
               responseData.previewUrl = emailResult.previewUrl;
               responseData.messageId = emailResult.messageId;
          }

          res.status(200).json(new ApiResponse(
               200,
               responseData,
               "New OTP sent to your email address"
          ));

     } catch (error) {
          throw new ApiError(500, "Error sending OTP email. Please try again.");
     }
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
    

     // finging user
     const user = await User.findOne({
          $or: [
               { email: emailOrUserName },
               { userName: emailOrUserName }
          ]
     })

     if (!user) throw new ApiError(400, "User not found")

     // Check if email is verified
     if (!user.isEmailVerified) {
          throw new ApiError(400, "Please verify your email before logging in. Check your email for OTP.");
     }

     const isPasswordCorrect = await user.isPasswordCorrect(password)

     if (!isPasswordCorrect) throw new ApiError(400, "Invalid Password")


     // generate access token
     const accessToken = user.generateAccessToken();

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
          sameSite: "None"
     })
     res.cookie(process.env.ACCESS_TOKEN_NAME, accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None"
     })
     res.status(200).json(new ApiResponse(
          200,
          {
               response
          },
          "Login succefully"
     ))


})


const logoutUser = asyncHandler(async (req, res) => {
     console.log("recieved")
     res.clearCookie(process.env.ACCESS_TOKEN_NAME, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
     });
     res.clearCookie(process.env.REFRESH_TOKEN_NAME, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
     })
     res.status(200).send(new ApiResponse(200, {}, "logout successfully"))
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
     const user = await User.findById(decode._id).select("-password -accessToken -resetToken");
     if (!user) throw new ApiError(401, "User not found")
     const accessToken = user.generateAccessToken();
     res.cookie(process.env.ACCESS_TOKEN_NAME, accessToken, {
          secure: true,
          httpOnly: true,
          sameSite: "None"
     }).json(new ApiResponse(200, user, "token refreshed successfully"))
})

// Forgot Password (Send OTP)
const forgotPassword = asyncHandler(async (req, res) => {
     const { email } = req.body;

     if (!email) {
          throw new ApiError(400, "Email is required");
     }

     // Find user by email
     const user = await User.findOne({ email: email.toLowerCase() });
     if (!user) {
          throw new ApiError(404, "User with this email does not exist");
     }

     // Generate password reset OTP
     const otp = user.generatePasswordResetOTP();

     // Save user with OTP
     await user.save({ validateBeforeSave: false });

     try {
          // Create email content
          const { message, html } = createPasswordResetOTP(otp, user.fullName);

          // Send OTP email
          const emailResult = await sendEmail({
               to: user.email,
               subject: 'Password Reset OTP - LLMbeing',
               message,
               html
          });

          // Prepare response data
          const responseData = {
               email: user.email,
               message: "Password reset OTP sent successfully!"
          };

          // In development, include preview URL for testing
          if (process.env.NODE_ENV === 'development' && emailResult.previewUrl) {
               responseData.previewUrl = emailResult.previewUrl;
               responseData.messageId = emailResult.messageId;
          }

          res.status(200).json(new ApiResponse(
               200,
               responseData,
               "Password reset OTP sent to your email address"
          ));

     } catch (error) {
          // Clear OTP if email sending fails
          user.passwordResetOTP = null;
          user.passwordResetOTPExpires = null;
          await user.save({ validateBeforeSave: false });

          throw new ApiError(500, "Error sending OTP email. Please try again later.");
     }
});

// Verify Password Reset OTP
const verifyPasswordResetOTP = asyncHandler(async (req, res) => {
     const { email, otp } = req.body;

     if (!email || !otp) {
          throw new ApiError(400, "Email and OTP are required");
     }

     // Find user by email
     const user = await User.findOne({ email: email.toLowerCase() });
     if (!user) {
          throw new ApiError(404, "User not found");
     }

     // Verify OTP
     const isOTPValid = user.verifyPasswordResetOTP(otp);
     if (!isOTPValid) {
          throw new ApiError(400, "Invalid or expired OTP");
     }

     // Generate a temporary reset token for password change
     const resetToken = user.generatePasswordResetToken();
     await user.save({ validateBeforeSave: false });

     // Set reset token as httpOnly cookie
     res.cookie('resetToken', resetToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 10 * 60 * 1000 // 10 minutes expiry
     });

     res.status(200).json(new ApiResponse(
          200,
          {
               email: user.email,
               message: "OTP verified successfully. You can now reset your password."
          },
          "OTP verified successfully"
     ));
})

// Reset Password with OTP Token
const resetPasswordWithToken = asyncHandler(async (req, res) => {
     const { newPassword } = req.body;

     // Get reset token from cookies
     const resetToken = req.cookies.resetToken;

     if (!resetToken || !newPassword) {
          throw new ApiError(400, "Reset token and new password are required");
     }

     // Validate password strength (same as registration)
     if (newPassword.length < 6) {
          throw new ApiError(400, "Password must be at least 6 characters long");
     }

     try {
          // Verify the reset token
          const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET);

          // Find user by ID from token
          const user = await User.findById(decoded._id);
          if (!user) {
               throw new ApiError(400, "Invalid reset token");
          }

          // Update password
          user.password = newPassword;
          user.resetPasswordToken = null; // Clear reset token
          user.refreshToken = null; // Clear existing refresh tokens for security
          user.passwordResetOTP = null; // Clear OTP
          user.passwordResetOTPExpires = null; // Clear OTP expiry

          await user.save();

          // Clear the reset token cookie
          res.clearCookie('resetToken', {
               httpOnly: true,
               secure: true,
               sameSite: "None"
          });

          // Remove sensitive data
          const userResponse = user.toObject();
          delete userResponse.password;
          delete userResponse.refreshToken;
          delete userResponse.resetPasswordToken;
          delete userResponse.passwordResetOTP;
          delete userResponse.passwordResetOTPExpires;

          res.status(200).json(new ApiResponse(
               200,
               {
                    message: "Password reset successful"
               },
               "Password has been reset successfully"
          ));

     } catch (error) {
          if (error.name === 'TokenExpiredError') {
               throw new ApiError(400, "Reset token has expired");
          } else if (error.name === 'JsonWebTokenError') {
               throw new ApiError(400, "Invalid reset token");
          }
          throw error;
     }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
     const { token } = req.params;
     const { password, confirmPassword } = req.body;

     if (!password || !confirmPassword) {
          throw new ApiError(400, "Password and confirm password are required");
     }

     if (password !== confirmPassword) {
          throw new ApiError(400, "Passwords do not match");
     }

     // Validate password strength (same as registration)
     if (password.length < 6) {
          throw new ApiError(400, "Password must be at least 6 characters long");
     }

     // Find user by reset token
     const user = await User.findByResetToken(token);
     if (!user) {
          throw new ApiError(400, "Invalid or expired reset token");
     }

     // Update password
     user.password = password;
     user.resetPasswordToken = null; // Clear reset token
     user.refreshToken = null; // Clear existing refresh tokens for security

     await user.save();

     // Remove sensitive data
     const userResponse = user.toObject();
     delete userResponse.password;
     delete userResponse.refreshToken;
     delete userResponse.resetPasswordToken;

     res.status(200).json(new ApiResponse(
          200,
          userResponse,
          "Password reset successfully"
     ));
})

// Check username availability
const checkUsernameAvailability = asyncHandler(async (req, res) => {
     const { username } = req.params;

     // Basic validation
     if (!username) {
          throw new ApiError(400, "Username is required");
     }

     // Check username format (3-20 chars, letters, numbers, underscore only)
     const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
     if (!usernameRegex.test(username)) {
          return res.status(200).json(new ApiResponse(
               200,
               {
                    username: username.toLowerCase(),
                    available: false,
                    reason: "Username must be 3-20 characters and contain only letters, numbers, and underscores"
               },
               "Username format invalid"
          ));
     }

     // Check if username exists (case-insensitive)
     const existingUser = await User.findOne({
          userName: username.toLowerCase()
     });

     const isAvailable = !existingUser;

     res.status(200).json(new ApiResponse(
          200,
          {
               username: username.toLowerCase(),
               available: isAvailable
          },
          isAvailable ? "Username is available" : "Username is already taken"
     ));
});

export { register, verifyEmailOTP, resendEmailOTP, login, verifyUser, refreshtoken, logoutUser, forgotPassword, verifyPasswordResetOTP, resetPassword, resetPasswordWithToken, checkUsernameAvailability }