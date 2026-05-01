import type{ Request, Response, NextFunction } from "express";
import type{ IAuthService } from "../../core/interfaces/services/IAuthService.js";
import { SignupRequestSchema, LoginRequestSchema } from "../../application/dtos/auth.dto.js";
import { UserMapper } from "../../application/mappers/user.mapper.js";
import { generateToken, getCookieOptions } from "../../utils/jwt.util.js";
import { AppError } from "../middlewares/AppError.js";
import type{ IAuthController } from "../../core/interfaces/controllers/IAuthController.js";
import { HttpStatusCode, AppMessages } from "../../utils/constants.js";

export class AuthController implements IAuthController {
  constructor(private readonly authService: IAuthService) {}

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = SignupRequestSchema.parse(req.body);
      const user = await this.authService.signup(validatedData);

      const token = generateToken({ id: user.id, email: user.email });
      res.cookie("jwt", token, getCookieOptions());

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        data: UserMapper.toResponseDto(user),
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return next(new AppError(error.errors[0].message, HttpStatusCode.BAD_REQUEST));
      }
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = LoginRequestSchema.parse(req.body);
      const user = await this.authService.login(validatedData);

      const token = generateToken({ id: user.id, email: user.email });
      res.cookie("jwt", token, getCookieOptions());

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: UserMapper.toResponseDto(user),
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return next(new AppError(error.errors[0].message, HttpStatusCode.BAD_REQUEST));
      }
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("jwt", "", { ...getCookieOptions(), maxAge: 1 });
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: AppMessages.LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(AppMessages.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);
      }

      const user = await this.authService.getUserById(userId);
      res.status(HttpStatusCode.OK).json({
        success: true,
        data: UserMapper.toResponseDto(user),
      });
    } catch (error: any) {
      next(error);
    }
  };
}
