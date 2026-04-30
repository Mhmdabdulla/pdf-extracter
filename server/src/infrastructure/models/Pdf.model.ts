import mongoose, { Schema, Document } from "mongoose";

export interface IPdfDocument extends Document {
  userId: mongoose.Types.ObjectId;
  s3Key: string;
  originalName: string;
  totalPageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PdfSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    s3Key: { type: String, required: true },
    originalName: { type: String, required: true },
    totalPageCount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const PdfModel = mongoose.model<IPdfDocument>("Pdf", PdfSchema);
