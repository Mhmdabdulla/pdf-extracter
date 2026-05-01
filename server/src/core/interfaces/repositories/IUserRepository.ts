import { UserEntity } from "../../entities/UserEntity.js";

export interface IUserRepository {
  save(user: Partial<UserEntity>): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}