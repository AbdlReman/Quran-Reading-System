import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    return NextResponse.json({
      emailUserConfigured: !!emailUser,
      emailPassConfigured: !!emailPass,
      emailUser: emailUser ? `${emailUser.substring(0, 3)}***@gmail.com` : 'Not configured',
      message: emailUser && emailPass ? 'Email configuration looks good!' : 'Email configuration missing'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check email configuration' },
      { status: 500 }
    );
  }
}
