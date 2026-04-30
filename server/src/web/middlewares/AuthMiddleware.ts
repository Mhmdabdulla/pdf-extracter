import type{ Request, Response, NextFunction } from "express";
import { AppError } from "./AppError.js";
import { verifyToken } from "../../utils/jwt.util.js";
import { HttpStatusCode, AppMessages } from "../../utils/constants.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const AuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Check cookies first
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } 
    // Fallback to Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(AppMessages.NO_TOKEN, HttpStatusCode.UNAUTHORIZED);
    }

    const decoded = verifyToken(token) as { id: string; email: string };
    req.user = decoded;

    next();
  } catch (error: any) {
    next(new AppError(AppMessages.INVALID_TOKEN, HttpStatusCode.UNAUTHORIZED));
  }
};
