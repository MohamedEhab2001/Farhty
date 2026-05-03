import { v2 as cloudinary } from 'cloudinary';

let cloudinaryConfigured = false;

function ensureCloudinaryConfig() {
  if (!cloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinaryConfigured = true;
  }
}

export interface SignedUploadParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export function generateSignedUploadParams(folder: string): SignedUploadParams {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Missing Cloudinary config: ' +
      [
        !cloudName && 'CLOUDINARY_CLOUD_NAME',
        !apiKey && 'CLOUDINARY_API_KEY',
        !apiSecret && 'CLOUDINARY_API_SECRET',
      ].filter(Boolean).join(', ')
    );
  }

  ensureCloudinaryConfig();

  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  );

  return {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder,
  };
}
