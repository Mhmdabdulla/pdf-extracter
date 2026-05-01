import { PDFDocument } from "pdf-lib";
import {type IPdfRepository } from "../interfaces/repositories/IPdfRepository.js";
import {type IFileStorage } from "../interfaces/repositories/IFileStorage.js";
import { PdfEntity } from "../entities/PdfEntity.js";
import {type IPdfService } from "../interfaces/services/IPdfService.js";
import { AppError } from "../../web/middlewares/AppError.js";
import { HttpStatusCode, AppMessages } from "../../utils/constants.js";

export class PdfService implements IPdfService {
  constructor(
    private readonly pdfRepository: IPdfRepository,
    private readonly fileStorage: IFileStorage
  ) {}

  /**
   * Generates a presigned URL for direct S3 upload from the client.
   */
  async getUploadUrl(userId: string, originalName: string, contentType: string): Promise<{ url: string; key: string }> {
    const key = `uploads/${userId}/${Date.now()}-${originalName}`;
    const url = await this.fileStorage.getUploadUrl(key, contentType);
    return { url, key };
  }

  /**
   * Saves metadata for an uploaded PDF to the database.
   */
  async savePdfMetadata(userId: string, key: string, originalName: string, totalPageCount: number): Promise<PdfEntity> {
    return this.pdfRepository.save({
      userId,
      s3Key: key,
      originalName,
      totalPageCount,
    });
  }

  /**
   * Retrieves all PDFs for a specific user.
   */
  async getUserPdfs(userId: string): Promise<PdfEntity[]> {
    return this.pdfRepository.findByUserId(userId);
  }

    /**
   * Retrieves a specific PDF for a user.
   */
  async getUserPdf(userId: string, pdfId: string): Promise<PdfEntity> {
    const pdf = await this.pdfRepository.findById(pdfId);
    if (!pdf) {
      throw new AppError(AppMessages.PDF_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }
    if (pdf.userId !== userId) {
      throw new AppError(AppMessages.UNAUTHORIZED_PDF_ACCESS, HttpStatusCode.FORBIDDEN);
    }
    return pdf;
  }

  /**
   * Extracts specific pages from an existing PDF, creates a new PDF,
   * uploads it to S3, and saves its metadata.
   */
  async extractPages(
    userId: string,
    pdfId: string,
    pagesArray: number[]
  ): Promise<PdfEntity> {
    // 1. Fetch the original PDF metadata
    const originalPdf = await this.pdfRepository.findById(pdfId);
    if (!originalPdf) {
      throw new AppError(AppMessages.PDF_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (originalPdf.userId !== userId) {
      throw new AppError(AppMessages.UNAUTHORIZED_PDF_ACCESS, HttpStatusCode.FORBIDDEN);
    }

    // 2. Fetch the buffer via IFileStorage
    const originalBuffer = await this.fileStorage.getFileBuffer(originalPdf.s3Key);

    // 3. Load the document and copy pages using pdf-lib
    const pdfDoc = await PDFDocument.load(originalBuffer);
    const newPdfDoc = await PDFDocument.create();

    // pdf-lib expects 0-indexed pages
    const zeroIndexedPages = pagesArray.map((p) => p - 1);
    
    // Filter out invalid page numbers
    const validPages = zeroIndexedPages.filter(p => p >= 0 && p < pdfDoc.getPageCount());
    if (validPages.length === 0) {
      throw new AppError(AppMessages.NO_VALID_PAGES, HttpStatusCode.BAD_REQUEST);
    }

    const copiedPages = await newPdfDoc.copyPages(pdfDoc, validPages);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));

    const newPdfBytes = await newPdfDoc.save();
    const newPdfBuffer = Buffer.from(newPdfBytes);

    // 4. Save the new PDF back via IFileStorage
    const newFileName = `extracted-${Date.now()}-${originalPdf.originalName}`;
    const newKey = `extractions/${userId}/${newFileName}`;
    
    await this.fileStorage.uploadBuffer(newKey, newPdfBuffer, "application/pdf");

    // 5. Update metadata via IPdfRepository
    const newPdfEntity = await this.pdfRepository.save({
      userId,
      s3Key: newKey,
      originalName: newFileName,
      totalPageCount: validPages.length,
    });

    return newPdfEntity;
  }

   /**
   * Generates a presigned download URL for a file.
   */
  async getDownloadUrl(key: string): Promise<string> {
    return this.fileStorage.getDownloadUrl(key);
  }


}
