import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import { container } from "../../di/container.js";

const router = Router();

const pdfController = container.pdfController;

// Protect all PDF routes
router.use(AuthMiddleware);

router.post("/presigned-url", pdfController.getPresignedUrl);
router.post("/metadata", pdfController.saveMetadata);
router.get("/", pdfController.getUserDocs);
router.post("/extract", pdfController.extractPages);
router.get("/:pdfId/download", pdfController.getDownloadUrl);

export default router;
