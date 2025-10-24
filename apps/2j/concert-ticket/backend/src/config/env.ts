// Environment variables тохиргоо
export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/concert-ticket',
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || extractCloudNameFromUrl(process.env.CLOUDINARY_URL || ''),
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ticket-booking',
    apiKey: process.env.CLOUDINARY_API_KEY || extractApiKeyFromUrl(process.env.CLOUDINARY_URL || ''),
    apiSecret: process.env.CLOUDINARY_API_SECRET || extractApiSecretFromUrl(process.env.CLOUDINARY_URL || ''),
  },
};

// Cloudinary URL-аас cloud name задлах функц
function extractCloudNameFromUrl(cloudinaryUrl: string): string {
  if (!cloudinaryUrl) return '';
  const match = cloudinaryUrl.match(/cloudinary:\/\/\d+:[\w-]+@([\w-]+)/);
  return match ? match[1] : '';
}

// Cloudinary URL-аас API key задлах функц
function extractApiKeyFromUrl(cloudinaryUrl: string): string {
  if (!cloudinaryUrl) return '';
  const match = cloudinaryUrl.match(/cloudinary:\/\/(\d+):/);
  return match ? match[1] : '';
}

// Cloudinary URL-аас API secret задлах функц
function extractApiSecretFromUrl(cloudinaryUrl: string): string {
  if (!cloudinaryUrl) return '';
  const match = cloudinaryUrl.match(/cloudinary:\/\/\d+:([\w-]+)@/);
  return match ? match[1] : '';
};
