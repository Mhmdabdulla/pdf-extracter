import bcrypt from "bcryptjs";
import type{ IUserRepository } from "../interfaces/repositories/IUserRepository.js";
import { UserEntity } from "../entities/UserEntity.js";
import type{ SignupRequestDto, LoginRequestDto } from "../../application/dtos/auth.dto.js";
import type{ IAuthService } from "../interfaces/services/IAuthService.js";
import { AppError } from "../../web/middlewares/AppError.js";
import { HttpStatusCode, AppMessages } from "../../utils/constants.js";

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async signup(data: SignupRequestDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(AppMessages.USER_ALREADY_EXISTS, HttpStatusCode.CONFLICT);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await this.userRepository.save({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(data: LoginRequestDto): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || !user.password) {
      throw new AppError(AppMessages.INVALID_CREDENTIALS, HttpStatusCode.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError(AppMessages.INVALID_CREDENTIALS, HttpStatusCode.UNAUTHORIZED);
    }

    return user;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(AppMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }
    return user;
  }
}
