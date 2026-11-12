import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NewsletterLead from '@/models/NewsletterLead';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    await dbConnect();

    const existing = await NewsletterLead.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'You are already subscribed', alreadySubscribed: true },
        { status: 200 }
      );
    }

    await NewsletterLead.create({
      email,
      source: body.source || 'footer',
      status: 'new',
    });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
}
