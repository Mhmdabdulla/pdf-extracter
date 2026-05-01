import type{ SignupRequestDto, LoginRequestDto } from "../../../application/dtos/auth.dto.js";
import { UserEntity } from "../../entities/UserEntity.js";

export interface IAuthService {
  signup(data: SignupRequestDto): Promise<UserEntity>;
  login(data: LoginRequestDto): Promise<UserEntity>;
  getUserById(id: string): Promise<UserEntity>;
}
