import {ApiError} from '../utils/ApiError.js';

const handleError = (err, req, res, next) => {
  let customError = err;

  // If it's not an instance of ApiError, convert it
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    customError = new ApiError(statusCode, message, err.errors, err.stack);
  }

  // MongoDB CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    customError = new ApiError(400, `Invalid ${err.path}: ${err.value}`,err.errors,err.stack);
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    customError = new ApiError(400, `Duplicate value entered for ${field}` ,err.errors,err.stack);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    customError = new ApiError(401, "Invalid token. Please login again.",err.errors,err.stack);
  }

  if (err.name === "TokenExpiredError") {
    customError = new ApiError(401, "Token expired. Please login again." ,err.errors,err.stack);
  }

  return res.status(customError.statusCode).json({
    success: customError.success,
    message: customError.message,
    errors: customError.errors,
    data: customError.data,
    ...(process.env.NODE_ENV === "development" && { stack: customError.stack }),
  });
};

export default handleError;
