import type{ Response, NextFunction } from "express";
import type{ AuthRequest } from "../../../web/middlewares/AuthMiddleware.js";

export interface IPdfController {
  getPresignedUrl(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  saveMetadata(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getUserDocs(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  extractPages(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
