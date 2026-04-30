import jwt from "jsonwebtoken";
import type{ CookieOptions } from "express";

const getSecret = () => process.env.JWT_SECRET || "default_secret_key";

export const generateToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: "1d" ,
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, getSecret());
};

export const getCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  };
};
