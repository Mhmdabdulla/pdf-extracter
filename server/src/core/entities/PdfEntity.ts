export class PdfEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly s3Key: string,
    public readonly originalName: string,
    public readonly totalPageCount: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
