import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { StorageService } from "../services/storage.services";
import { logger } from "../utils/logger";

export class UploadController {
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  // ENTRY POINT TO API - binded to upload route
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      let isSingleFile;
      if (Array.isArray(req?.files?.files)) {
        isSingleFile = false;
      } else if (typeof req?.files?.files === "object") {
        isSingleFile = true;
      }

      const file = isSingleFile
        ? (req.files.files as UploadedFile)
        : (req.files.files as UploadedFile[]);

      if (isSingleFile) {
        const fileData = (file as UploadedFile).data;
        const fileName = (file as UploadedFile).name;

        const s3Key = await this.storageService.uploadFile([
          {
            buffer: fileData,
            name: fileName,
          },
        ]);

        logger.info(`File uploaded to S3 with key: ${s3Key}`);

        // Parse processing options with defaults
        const processingOptions = {
          skipRows: req.body.skipRows ? parseInt(req.body.skipRows) : 0,
          columnMapping: req.body.columnMapping
            ? JSON.parse(req.body.columnMapping)
            : {},
          validationRules: req.body.validationRules
            ? JSON.parse(req.body.validationRules)
            : [],
        };

        console.log(">>", s3Key);
        res.status(202).json({
          message: "File uploaded and queued for processing",
          fileName,
        });
      } else {
        if (Array.isArray(file)) {
          const uploadFileConfig = [];
          for (let i = 0; i < file.length; i++) {
            const fileData = (file[i] as UploadedFile).data;
            const fileName = (file[i] as UploadedFile).name;

            uploadFileConfig.push({
              buffer: fileData,
              name: fileName,
            });
            const s3Key = await this.storageService.uploadFile([
              {
                buffer: fileData,
                name: fileName,
              },
            ]);
          }
        }
        res.status(202).json({
          message: "File uploaded and queued for processing",
        });
      }
    } catch (error) {
      logger.error("Error in file upload:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
