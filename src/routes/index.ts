import { Router } from "express";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/upload", uploadRoutes);

// Health check route
router.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

export default router;
