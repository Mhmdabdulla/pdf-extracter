import type{ IUserRepository } from "../../core/interfaces/repositories/IUserRepository.js";
import { UserEntity } from "../../core/entities/UserEntity.js";
import { UserModel } from "../models/User.model.js";
import { AppError } from "../../web/middlewares/AppError.js";
import { HttpStatusCode, AppMessages } from "../../utils/constants.js";

export class MongoUserRepository implements IUserRepository {
  private mapToEntity(doc: any): UserEntity {
    return new UserEntity(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.password,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async save(user: Partial<UserEntity>): Promise<UserEntity> {
    if (user.id) {
      const updated = await UserModel.findByIdAndUpdate(
        user.id,
        { ...user },
        { new: true }
      );
      if (!updated) throw new AppError(AppMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
      return this.mapToEntity(updated);
    }

    const created = await UserModel.create({
      name: user.name!,
      email: user.email!,
      password: user.password!,
    });
    return this.mapToEntity(created);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return this.mapToEntity(doc);
  }
}