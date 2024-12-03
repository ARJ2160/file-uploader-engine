import { Router } from "express";
import { UploadController } from "../controller/upload.controller";

const router = Router();
const uploadController = new UploadController();

router.post("/", uploadController.uploadFile.bind(uploadController));

export default router;
