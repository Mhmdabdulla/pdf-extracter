import { PdfEntity } from "../../entities/PdfEntity.js";

export interface IPdfRepository {
  save(pdf: Partial<PdfEntity>): Promise<PdfEntity>;
  findByUserId(userId: string): Promise<PdfEntity[]>;
  findById(id: string): Promise<PdfEntity | null>;
}
