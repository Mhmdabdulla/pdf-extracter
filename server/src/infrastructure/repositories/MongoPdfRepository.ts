import type{ IPdfRepository } from "../../core/interfaces/repositories/IPdfRepository.js";
import { PdfEntity } from "../../core/entities/PdfEntity.js";
import { PdfModel } from "../models/Pdf.model.js";
import { AppError } from "../../web/middlewares/AppError.js";
import { HttpStatusCode, AppMessages } from "../../utils/constants.js";

export class MongoPdfRepository implements IPdfRepository {
  private mapToEntity(doc: any): PdfEntity {
    return new PdfEntity(
      doc._id.toString(),
      doc.userId.toString(),
      doc.s3Key,
      doc.originalName,
      doc.totalPageCount,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async save(pdf: Partial<PdfEntity>): Promise<PdfEntity> {
    if (pdf.id) {
      const updated = await PdfModel.findByIdAndUpdate(
        pdf.id,
        { ...pdf },
        { new: true }
      );
      if (!updated) throw new AppError(AppMessages.PDF_NOT_FOUND, HttpStatusCode.NOT_FOUND);
      return this.mapToEntity(updated);
    }

    const created = await PdfModel.create({
      userId: pdf.userId!,
      s3Key: pdf.s3Key!,
      originalName: pdf.originalName!,
      totalPageCount: pdf.totalPageCount!,
    });
    return this.mapToEntity(created);
  }

  async findByUserId(userId: string): Promise<PdfEntity[]> {
    const docs = await PdfModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map(this.mapToEntity);
  }

  async findById(id: string): Promise<PdfEntity | null> {
    const doc = await PdfModel.findById(id);
    if (!doc) return null;
    return this.mapToEntity(doc);
  }
}
