import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TrialLead from '@/models/TrialLead';
import { isEmailConfigured, sendAppMail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country, phone, course, source } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const savedLead = await TrialLead.create({
      name: String(name).trim(),
      country: country ? String(country).trim() : '',
      phone: String(phone).trim(),
      course: course ? String(course).trim() : '',
      source: source ? String(source).trim() : '',
      status: 'new',
    });

    if (isEmailConfigured()) {
      try {
        await sendAppMail({
          replyTo: process.env.EMAIL_USER,
          label: 'Trial Request',
          subject: `New Free Trial Class Request: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #12433f, #1a5c55); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 26px;">New Free Trial Class Request</h1>
                <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Quran Reading System Website</p>
              </div>
              <div style="padding: 30px;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Country:</strong> ${country || 'Not provided'}</p>
                <p><strong>Desired Course:</strong> ${course || 'Not provided'}</p>
                <p><strong>Heard About Us Via:</strong> ${source || 'Not provided'}</p>
                <p style="color:#6b7280;font-size:12px;">Saved in admin panel (ID: ${savedLead._id})</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Trial email notify failed (lead still saved):', emailError);
      }
    }

    return NextResponse.json(
      { message: 'Request submitted successfully', id: savedLead._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving trial request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request. Please try again.' },
      { status: 500 }
    );
  }
}
