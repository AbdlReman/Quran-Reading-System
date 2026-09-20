import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@qurvia.com' });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 200 }
      );
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@qurvia.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });

    await adminUser.save();

    return NextResponse.json(
      { 
        message: 'Admin user created successfully',
        credentials: {
          email: 'admin@qurvia.com',
          password: 'admin123'
        }
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
