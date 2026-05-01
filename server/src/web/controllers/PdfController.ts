import type{ Response, NextFunction } from "express";
import {type IPdfService } from "../../core/interfaces/services/IPdfService.js";
import type{ AuthRequest } from "../middlewares/AuthMiddleware.js";
import { AppError } from "../middlewares/AppError.js";
import { 
  PresignedUrlRequestSchema, 
  SaveMetadataRequestSchema, 
  ExtractPagesRequestSchema 
} from "../../application/dtos/pdf.dto.js";
import { PdfMapper } from "../../application/mappers/pdf.mapper.js";
import {type IPdfController } from "../../core/interfaces/controllers/IPdfController.js";
import { HttpStatusCode, AppMessages } from "../../utils/constants.js";

export class PdfController implements IPdfController {
  constructor(private readonly pdfService: IPdfService) {}

  getPresignedUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = PresignedUrlRequestSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) throw new AppError(AppMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);

      const result = await this.pdfService.getUploadUrl(userId, validatedData.originalName, validatedData.contentType);
      res.status(HttpStatusCode.OK).json({ success: true, data: result });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return next(new AppError(error.errors[0].message, HttpStatusCode.BAD_REQUEST));
      }
      next(error);
    }
  };

  saveMetadata = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = SaveMetadataRequestSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) throw new AppError(AppMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);

      const pdf = await this.pdfService.savePdfMetadata(userId, validatedData.key, validatedData.originalName, validatedData.totalPageCount);
      res.status(HttpStatusCode.CREATED).json({ success: true, data: PdfMapper.toResponseDto(pdf) });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return next(new AppError(error.errors[0].message, HttpStatusCode.BAD_REQUEST));
      }
      next(error);
    }
  };

  getUserDocs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError(AppMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);

      const pdfs = await this.pdfService.getUserPdfs(userId);
      res.status(HttpStatusCode.OK).json({ success: true, data: PdfMapper.toResponseDtoArray(pdfs) });
    } catch (error) {
      next(error);
    }
  };

  extractPages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = ExtractPagesRequestSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) throw new AppError(AppMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);

      const newPdf = await this.pdfService.extractPages(userId, validatedData.pdfId, validatedData.pagesArray);
      res.status(HttpStatusCode.OK).json({ success: true, data: PdfMapper.toResponseDto(newPdf) });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return next(new AppError(error.errors[0].message, HttpStatusCode.BAD_REQUEST));
      }
      next(error);
    }
  };

  getDownloadUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { pdfId } = req.params;
      const userId = req.user?.id;
      const parsedPdfId = Array.isArray(pdfId) ? pdfId[0] : pdfId;

      if (!userId) throw new AppError(AppMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);
      if (!parsedPdfId) throw new AppError(AppMessages.PDF_ID_MISSING, HttpStatusCode.BAD_REQUEST);

      const pdf = await this.pdfService.getUserPdf(userId, parsedPdfId);
      const downloadUrl = await this.pdfService.getDownloadUrl(pdf.s3Key);

      res.status(HttpStatusCode.OK).json({ success: true, data: { downloadUrl } });
    } catch (error) {
      next(error);
    }
  };

}
