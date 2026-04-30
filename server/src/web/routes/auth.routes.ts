import express from 'express';
import { container } from "../../di/container.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

const authController = container.authController;

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", AuthMiddleware , authController.getCurrentUser);

export default router;