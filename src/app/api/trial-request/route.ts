import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country, phone, course, source } = body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      console.error('Email configuration missing:', {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        EMAIL_TO: !!process.env.EMAIL_TO
      });
      return NextResponse.json(
        { error: 'Email service not configured. Please contact administrator.' },
        { status: 500 }
      );
    }

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminMailOptions = {
      from: `"Quran Reading System Trial Request" <${process.env.EMAIL_USER}>`,
      replyTo: 'info@quranreadingsystem.com',
      to: process.env.EMAIL_TO,
      subject: `New Free Trial Class Request: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 26px;">🎓 New Free Trial Class Request</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Quran Reading System Website</p>
          </div>

          <div style="padding: 30px; background-color: #ffffff;">
            <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; border-left: 5px solid #059669;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 160px;">Name:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                  <td style="padding: 8px 0; color: #1f2937;"><a href="tel:${phone}" style="color: #059669; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Country:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${country || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Desired Course:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${course || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Heard About Us Via:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${source || 'Not provided'}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-top: 25px; border-left: 5px solid #059669;">
              <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px;">📋 Submission Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #065f46; width: 120px;">Received:</td>
                  <td style="padding: 5px 0; color: #065f46;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #065f46;">IP Address:</td>
                  <td style="padding: 5px 0; color: #065f46;">${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Not available'}</td>
                </tr>
              </table>
            </div>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              This email was automatically generated from the Quran Reading System free trial class popup.
            </p>
          </div>
        </div>
      `,
    };

    const adminResult = await transporter.sendMail(adminMailOptions);
    console.log('Trial request email sent:', adminResult.messageId);

    return NextResponse.json(
      { message: 'Request submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending trial request email:', error);

    let errorMessage = 'Failed to submit request';
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Email authentication failed. Please check email credentials.';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Network error. Please check internet connection.';
      } else {
        errorMessage = `Email error: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
