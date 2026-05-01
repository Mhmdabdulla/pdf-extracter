export interface IFileStorage {
  getUploadUrl(key: string, contentType: string): Promise<string>;
  getDownloadUrl(key: string): Promise<string>;
  getFileBuffer(key: string): Promise<Buffer>;
  uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<void>;
}
