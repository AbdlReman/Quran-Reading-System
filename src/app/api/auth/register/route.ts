import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Rate limiting store (in production, use Redis)
const registrationAttempts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempt = registrationAttempts.get(ip);
  
  if (!attempt) {
    registrationAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return false;
  }
  
  if (now > attempt.resetTime) {
    registrationAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return false;
  }
  
  if (attempt.count >= 5) {
    return true;
  }
  
  attempt.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, password, role, phone, address, dateOfBirth } = await request.json();

    // Enhanced validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Name validation
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 50 characters long' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return NextResponse.json(
        { error: 'Name can only contain letters and spaces' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' },
        { status: 400 }
      );
    }

    // Role validation
    if (role && !['student', 'teacher'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Only student and teacher roles are allowed for registration' },
        { status: 400 }
      );
    }

    // Phone validation (if provided)
    if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Address validation (if provided)
    if (address && address.length > 200) {
      return NextResponse.json(
        { error: 'Address cannot exceed 200 characters' },
        { status: 400 }
      );
    }

    // Date of birth validation (if provided)
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (age < 5 || age > 100) {
        return NextResponse.json(
          { error: 'Date of birth must be valid and age must be between 5 and 100 years' },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // For now: auto-verify email and skip token generation

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'student',
      phone: phone?.trim(),
      address: address?.trim(),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      isEmailVerified: true,
    });

    await user.save();

    // Skipping email verification email for now per requirements

    // Return user without sensitive data
    const userObject = user.toObject();
    const userWithoutSensitiveData = {
      id: userObject._id,
      name: userObject.name,
      email: userObject.email,
      role: userObject.role,
      phone: userObject.phone,
      address: userObject.address,
      dateOfBirth: userObject.dateOfBirth,
      isEmailVerified: userObject.isEmailVerified,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt
    };

    return NextResponse.json(
      { 
        message: 'User registered successfully.',
        user: userWithoutSensitiveData 
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as unknown as { errors: Record<string, { message: string }> };
      const validationErrors = Object.values(validationError.errors).map((err) => err.message);
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
