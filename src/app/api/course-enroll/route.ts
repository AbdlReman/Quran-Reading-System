import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import CourseEnrollment from '@/models/CourseEnrollment';
import coursesData from '@/app/data/courses.json';
import { isEmailConfigured, sendAppMail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = session ? (session as any).user : null;
    const isLoggedIn = Boolean(sessionUser?.id);

    const body = await request.json();
    const { courseId, age, education, country, notes, name, email, phone } = body;

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

    let finalName = typeof name === 'string' ? name.trim() : '';
    let finalEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    let finalPhone = typeof phone === 'string' ? phone.trim() : '';
    let userId: string | undefined;

    if (isLoggedIn) {
      const user = await User.findById(sessionUser.id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const already = (user.enrollments || []).some(
        (e: { courseId: number }) => e.courseId === course.id
      );
      if (already) {
        return NextResponse.json({ message: 'Already enrolled' }, { status: 200 });
      }

      finalName = user.name;
      finalEmail = user.email;
      finalPhone = user.phone || finalPhone || 'N/A';
      userId = String(user._id);

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
          phone: finalPhone === 'N/A' ? '' : finalPhone,
          country: countryValue,
          notes: notesValue,
        },
      ];
      await user.save();
    } else {
      if (!finalName || finalName.length < 2) {
        return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
      }
      if (!finalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
      }
      if (!finalPhone || finalPhone.replace(/[^\d]/g, '').length < 7) {
        return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
      }
    }

    const countryValue = typeof country === 'string' ? country.trim() : '';
    const notesValue = typeof notes === 'string' ? notes.trim() : '';

    const saved = await CourseEnrollment.create({
      name: finalName,
      email: finalEmail,
      phone: finalPhone,
      age: ageNum,
      education: education.trim(),
      country: countryValue,
      notes: notesValue,
      courseId: course.id,
      courseTitle: course.title,
      userId: userId || undefined,
      source: isLoggedIn ? 'logged_in' : 'guest',
      status: 'new',
    });

    if (isEmailConfigured()) {
      try {
        await sendAppMail({
          replyTo: finalEmail !== 'N/A' ? finalEmail : process.env.EMAIL_USER,
          label: 'Course Enrollment',
          subject: `New Course Enrollment: ${course.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #12433f, #1a5c55); padding: 28px; border-radius: 8px 8px 0 0;">
                <h1 style="color:#fff;margin:0;font-size:24px;">New Course Enrollment</h1>
              </div>
              <div style="padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;">
                <p><strong>Course:</strong> ${course.title}</p>
                <p><strong>Name:</strong> ${finalName}</p>
                <p><strong>Email:</strong> ${finalEmail}</p>
                <p><strong>Phone:</strong> ${finalPhone}</p>
                <p><strong>Age:</strong> ${ageNum}</p>
                <p><strong>Education:</strong> ${education}</p>
                <p><strong>Country:</strong> ${countryValue || '—'}</p>
                <p><strong>Notes:</strong> ${notesValue || '—'}</p>
                <p><strong>Source:</strong> ${isLoggedIn ? 'Logged-in user' : 'Guest'}</p>
                <p style="color:#6b7280;font-size:12px;">Admin ID: ${saved._id}</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Enrollment email notify failed (still saved):', emailError);
      }
    }

    return NextResponse.json(
      { message: 'Enrolled successfully', id: saved._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Course enroll error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
