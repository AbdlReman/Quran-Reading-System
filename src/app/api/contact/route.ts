import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    // Check if email configuration is set up
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

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    // Email content for admin
    const adminMailOptions = {
      from: `"Quran Reading System Contact Form" <${process.env.EMAIL_USER}>`, // Must match authenticated account
      replyTo: 'info@quranreadingsystem.com', // This will be the reply-to address
      to: process.env.EMAIL_TO, // Send to admin email address
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📧 New Contact Form Submission</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Quran Reading System Website</p>
          </div>
          
          <!-- Form Details -->
          <div style="padding: 30px; background-color: #ffffff;">
            <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 5px solid #059669;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">👤 Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Full Name:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                  <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${email}" style="color: #059669; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${phone ? `<a href="tel:${phone}" style="color: #059669; text-decoration: none;">${phone}</a>` : '<em style="color: #6b7280;">Not provided</em>'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject:</td>
                  <td style="padding: 8px 0; color: #1f2937; background-color: #ecfdf5; padding: 8px 12px; border-radius: 4px; display: inline-block;">${subject}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #ffffff; padding: 25px; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">💬 Message Content</h2>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border-left: 4px solid #059669;">
                <p style="line-height: 1.8; color: #374151; margin: 0; font-size: 16px; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">⚡ Quick Actions</h3>
              <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <a href="mailto:${email}?subject=Re: ${subject}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">📧 Reply to ${firstName}</a>
                ${phone ? `<a href="tel:${phone}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">📞 Call ${firstName}</a>` : ''}
              </div>
            </div>
            
            <!-- Submission Details -->
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 5px solid #059669;">
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
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #065f46;">User Agent:</td>
                  <td style="padding: 5px 0; color: #065f46; font-size: 12px;">${request.headers.get('user-agent') || 'Not available'}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              This email was automatically generated from the Quran Reading System contact form.
            </p>
          </div>
        </div>
      `,
    };


    // Send only admin email
    console.log('Sending admin email to:', process.env.EMAIL_TO);
    
    const adminResult = await transporter.sendMail(adminMailOptions);

    console.log('Admin email sent:', adminResult.messageId);
    console.log('Email sent successfully');
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email';
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
