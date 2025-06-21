import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
// import { MongooseError } from 'mongoose';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error caught by error handler:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errorDetails: unknown = err;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    const errors: { [key: string]: unknown } = {};
    for (const field in err.errors) {
      errors[field] = {
        message: err.errors[field].message,
        name: err.errors[field].name,
        properties: err.errors[field].properties,
        kind: err.errors[field].kind,
        path: err.errors[field].path,
        value: err.errors[field].value,
      };
    }
    errorDetails = { name: "ValidationError", errors };
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    errorDetails = {
      name: "DuplicateKeyError",
      message: `${field} already exists`,
    };
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errorDetails = {
      name: "CastError",
      message: `Invalid ${err.path}: ${err.value}`,
    };
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails =
      err.errors.length > 0
        ? { name: err.name, errors: err.errors }
        : { name: err.name, message: err.message };
  }

  res.status(statusCode).json({
    message,
    success: false,
    error: errorDetails,
  });
};

export default errorHandler;
