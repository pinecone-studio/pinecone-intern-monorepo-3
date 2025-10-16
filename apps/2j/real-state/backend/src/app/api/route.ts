import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Real Estate Backend API',
    version: '1.0.0',
    endpoints: {
      graphql: '/api/graphql',
      health: '/api/health'
    }
  });
}
