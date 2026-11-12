import { NextResponse } from 'next/server';
import { isEmailConfigured } from '@/lib/mailer';

export async function GET() {
  try {
    const emailUser = process.env.EMAIL_USER || '';
    const emailHost = process.env.EMAIL_HOST || 'smtp.hostinger.com';

    return NextResponse.json({
      configured: isEmailConfigured(),
      emailUserConfigured: !!process.env.EMAIL_USER,
      emailPassConfigured: !!process.env.EMAIL_PASS,
      emailToConfigured: !!process.env.EMAIL_TO,
      host: emailHost,
      port: process.env.EMAIL_PORT || '465',
      fromName: process.env.EMAIL_FROM_NAME || 'Quran Reading System',
      emailUser: emailUser
        ? `${emailUser.slice(0, 4)}***@${emailUser.split('@')[1] || ''}`
        : 'Not configured',
      message: isEmailConfigured()
        ? 'Hostinger email configuration looks good!'
        : 'Email configuration missing. Set EMAIL_USER, EMAIL_PASS, and EMAIL_TO.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to check email configuration' },
      { status: 500 }
    );
  }
}
