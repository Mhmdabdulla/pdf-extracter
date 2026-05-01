import { UserEntity } from "../../core/entities/UserEntity.js";
import type{ UserResponseDto } from "../dtos/user.dto.js";

export class UserMapper {
  static toResponseDto(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
