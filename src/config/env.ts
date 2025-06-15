export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  r2: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
    bucketName: import.meta.env.VITE_R2_BUCKET_NAME || '',
    endpoint: import.meta.env.VITE_R2_ENDPOINT || '',
    publicUrl: import.meta.env.VITE_R2_PUBLIC_URL || '',
  },
};