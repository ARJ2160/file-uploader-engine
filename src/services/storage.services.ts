import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../utils/logger";

export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.AWS_BUCKET_NAME || "excel-processor";
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  /**
   * This method uploads a file to S3.
   * @param fileBuffer Buffer with the file contents
   * @param fileName Name of the file to upload
   * @returns Key of the uploaded file
   */
  async uploadFile(
    files: { buffer: Buffer; name: string }[]
  ): Promise<string[]> {
    try {
      const uploadedKeys: string[] = [];
      for (const file of files) {
        const { buffer, name } = file;
        try {
          const key = `uploads/${Date.now()}-${name}`;

          console.log(">>>", key);
          await this.s3Client.send(
            new PutObjectCommand({
              Bucket: this.bucket,
              Key: key,
              Body: buffer,
            })
          );

          logger.info(`File uploaded to S3: ${key}`);
          uploadedKeys.push(key);
        } catch (error) {
          logger.error("Error uploading file to S3:", error);
          throw error;
        }
      }
      return uploadedKeys;
    } catch (error) {
      logger.error("Error uploading file to S3:", error);
      throw error;
    }
  }
}
