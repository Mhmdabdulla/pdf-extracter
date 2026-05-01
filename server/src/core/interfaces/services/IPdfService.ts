import { PdfEntity } from "../../entities/PdfEntity.js";

export interface IPdfService {
  getUploadUrl(userId: string, originalName: string, contentType: string): Promise<{ url: string; key: string }>;
  savePdfMetadata(userId: string, key: string, originalName: string, totalPageCount: number): Promise<PdfEntity>;
  getUserPdfs(userId: string): Promise<PdfEntity[]>;
  getUserPdf(userId: string, pdfId: string): Promise<PdfEntity>;
  extractPages(userId: string, pdfId: string, pagesArray: number[]): Promise<PdfEntity>;
  getDownloadUrl(key: string): Promise<string>;
}
