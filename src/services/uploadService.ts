import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config/env';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: config.r2.endpoint,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
  forcePathStyle: true, // <-- Add this line
});

export const uploadService = {
  async uploadFile(file: File, path: string = '') {
    try {
      const key = `${path}${Date.now()}-${file.name}`;
      
      await s3Client.send(
        new PutObjectCommand({
          Bucket: config.r2.bucketName,
          Key: key,
          Body: await file.arrayBuffer(),
          ContentType: file.type,
        })
      );

      return `${config.r2.publicUrl}/${key}`;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  },

  async uploadMultipleFiles(files: File[], path: string = '') {
    const uploadPromises = files.map((file) => this.uploadFile(file, path));
    return Promise.all(uploadPromises);
  },
};