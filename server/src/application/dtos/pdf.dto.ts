import { z } from "zod";

export const PresignedUrlRequestSchema = z.object({
  originalName: z.string().min(1, "originalName is required"),
  contentType: z.string().min(1, "contentType is required"),
});

export type PresignedUrlRequestDto = z.infer<typeof PresignedUrlRequestSchema>;

export const SaveMetadataRequestSchema = z.object({
  key: z.string().min(1, "key is required"),
  originalName: z.string().min(1, "originalName is required"),
  totalPageCount: z.number().int().positive("totalPageCount must be a positive integer"),
});

export type SaveMetadataRequestDto = z.infer<typeof SaveMetadataRequestSchema>;

export const ExtractPagesRequestSchema = z.object({
  pdfId: z.string().min(1, "pdfId is required"),
  pagesArray: z.array(z.number().int().positive()).min(1, "At least one page must be selected"),
});

export type ExtractPagesRequestDto = z.infer<typeof ExtractPagesRequestSchema>;

export interface PdfResponseDto {
  id: string;
  userId: string;
  s3Key: string;
  originalName: string;
  totalPageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
