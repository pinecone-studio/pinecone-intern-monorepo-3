import { NextRequest, NextResponse } from 'next/server';

const createSvgResponse = (width: number, height: number, text: string) => {
  return new NextResponse(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="${width > 500 ? '24' : '16'}" fill="#6b7280">
        ${text}
      </text>
    </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    }
  );
};

const handleMapPlaceholder = () => {
  return createSvgResponse(600, 400, 'Map Placeholder');
};

const handleSizePlaceholder = (pathParams: string[]) => {
  const [width, height] = pathParams;
  const widthNum = parseInt(width, 10) || 300;
  const heightNum = parseInt(height, 10) || 300;
  return createSvgResponse(widthNum, heightNum, `${widthNum} × ${heightNum}`);
};

const handleDefaultPlaceholder = () => {
  return createSvgResponse(300, 300, 'Image Placeholder');
};

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const { params: pathParams } = params;
  
  if (pathParams[0] === 'map') {
    return handleMapPlaceholder();
  }
  
  if (pathParams.length === 2) {
    return handleSizePlaceholder(pathParams);
  }
  
  return handleDefaultPlaceholder();
}
