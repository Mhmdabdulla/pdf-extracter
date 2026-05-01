import { PdfEntity } from "../../core/entities/PdfEntity.js";
import type{ PdfResponseDto } from "../dtos/pdf.dto.js";

export class PdfMapper {
  static toResponseDto(entity: PdfEntity): PdfResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      s3Key: entity.s3Key,
      originalName: entity.originalName,
      totalPageCount: entity.totalPageCount,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toResponseDtoArray(entities: PdfEntity[]): PdfResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
