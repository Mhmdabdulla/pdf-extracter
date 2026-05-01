import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {type IFileStorage } from "../../core/interfaces/repositories/IFileStorage.js";
import { AppError } from "../../web/middlewares/AppError.js";
import { HttpStatusCode } from "../../utils/constants.js";
import s3Client from "../../config/s3.js";
import { access } from "node:fs";

export class S3StorageRepository implements IFileStorage {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    console.log("Initializing S3StorageRepository with bucket:", process.env.AWS_S3_BUCKET_NAME, "and region:", process.env.AWS_REGION , 'secret access key:', process.env.AWS_SECRET_ACCESS_KEY ? '***' : 'not set , access key id:', process.env.AWS_ACCESS_KEY_ID ? '***' : 'not set ');
    this.s3Client = s3Client
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || "pdf-extractor-bucket";
  }

  async getUploadUrl(key: string, contentType: string): Promise<string> {
    console.log("Generating presigned URL for S3 upload with key:", key, "and contentType:", contentType);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      ChecksumAlgorithm: undefined
    });
    // URL expires in 15 minutes
    return await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
  }

  async getDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    if (!response.Body) {
      throw new AppError(`Failed to retrieve file from S3: ${key}`, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }

    const stream = response.Body as NodeJS.ReadableStream;
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  async uploadBuffer(
    key: string,
    buffer: Buffer,
    contentType: string
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
  }
}
