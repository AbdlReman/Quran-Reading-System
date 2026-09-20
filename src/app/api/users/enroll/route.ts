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

    const { courseId, notes } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    // find course by id from static data
    const course = (coursesData as { courses: Array<{ id: number; title: string }> }).courses.find(
      (c) => c.id === Number(courseId)
    );
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    await dbConnect();
    // Add enrollment to user if not enrolled yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await User.findById((session as any).user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const already = (user.enrollments || []).some((e: { courseId: number }) => e.courseId === course.id);
    if (already) {
      return NextResponse.json({ message: 'Already enrolled' }, { status: 200 });
    }

    user.enrollments = [
      ...(user.enrollments || []),
      { courseId: course.id, courseTitle: course.title, enrolledAt: new Date(), notes: notes || '' },
    ];
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

    return NextResponse.json({ enrollments: user.enrollments || [] }, { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } });
  } catch (error) {
    console.error('Get enrollments error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


