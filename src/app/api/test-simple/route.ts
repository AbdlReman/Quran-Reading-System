import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(
      { 
        message: 'Simple API test successful',
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: process.env.NODE_ENV || 'development',
          hasMongoUri: !!process.env.MONGODB_URI,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
          hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
          mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
        }
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Simple API test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Simple API test failed',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json(
      { 
        message: 'POST test successful',
        receivedData: body,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('POST test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'POST test failed',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
