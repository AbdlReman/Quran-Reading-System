import { NextResponse } from 'next/server';

export async function GET() {
  const requiredEnvVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  const hasAllVars = missingVars.length === 0;

  return NextResponse.json(
    {
      status: hasAllVars ? 'ok' : 'missing_variables',
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasAllRequiredVars: hasAllVars,
        missingVariables: missingVars,
        variables: {
          MONGODB_URI: requiredEnvVars.MONGODB_URI ? 'Set' : 'Missing',
          NEXTAUTH_SECRET: requiredEnvVars.NEXTAUTH_SECRET ? 'Set' : 'Missing',
          NEXTAUTH_URL: requiredEnvVars.NEXTAUTH_URL ? 'Set' : 'Missing',
        }
      },
      timestamp: new Date().toISOString()
    },
    { status: hasAllVars ? 200 : 500 }
  );
}
