import { NextRequest, NextResponse } from 'next/server';
import { config } from '../../../config/env';

// Cloudinary тохиргооны мэдээллийг frontend-д илгээх
export async function GET(_request: NextRequest) {
  try {
    // Зөвхөн шаардлагатай мэдээллийг илгээх (API key, secret-ийг нуух)
    const cloudinaryConfig = {
      cloudName: config.cloudinary.cloudName,
      uploadPreset: config.cloudinary.uploadPreset,
    };

    return NextResponse.json(cloudinaryConfig);
  } catch (error) {
    console.error('Error getting Cloudinary config:', error);
    return NextResponse.json(
      { error: 'Failed to get Cloudinary configuration' },
      { status: 500 }
    );
  }
}
