import type{ Request, Response, NextFunction } from "express";
import { AppError } from "./AppError.js";
import { HttpStatusCode, AppMessages } from "../../utils/constants.js";

export const ErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  let message: string = AppMessages.INTERNAL_SERVER_ERROR;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error("Unhandled Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};
