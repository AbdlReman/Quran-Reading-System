import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import coursesData from '@/app/data/courses.json';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, age, education, phone, country, notes } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const ageNum = Number(age);
    if (!age || Number.isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
      return NextResponse.json({ error: 'Valid age (3–100) is required' }, { status: 400 });
    }
    if (!education || typeof education !== 'string' || !education.trim()) {
      return NextResponse.json({ error: 'Education is required' }, { status: 400 });
    }

    const course = (coursesData as { courses: Array<{ id: number; title: string }> }).courses.find(
      (c) => c.id === Number(courseId)
    );
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await User.findById((session as any).user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const already = (user.enrollments || []).some(
      (e: { courseId: number }) => e.courseId === course.id
    );
    if (already) {
      return NextResponse.json({ message: 'Already enrolled' }, { status: 200 });
    }

    const rawPhone = typeof phone === 'string' ? phone.trim() : '';
    const phoneValue = rawPhone.replace(/[^\d+]/g, '');
    const countryValue = typeof country === 'string' ? country.trim() : '';
    const notesValue = typeof notes === 'string' ? notes.trim() : '';

    user.enrollments = [
      ...(user.enrollments || []),
      {
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: new Date(),
        age: ageNum,
        education: education.trim(),
        phone: rawPhone || phoneValue,
        country: countryValue,
        notes: notesValue,
      },
    ];

    if (phoneValue && !user.phone && /^\+?[1-9]\d{0,15}$/.test(phoneValue)) {
      user.phone = phoneValue;
    }

    await user.save();

    return NextResponse.json({ message: 'Enrolled successfully' }, { status: 200 });
  } catch (error) {
    console.error('Enroll error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await User.findById((session as any).user.id).select('enrollments name email');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { enrollments: user.enrollments || [] },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
      }
    );
  } catch (error) {
    console.error('Get enrollments error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
