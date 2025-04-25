import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { registerSchema } from '@/lib/validations/auth';
import { sendVerificationEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse and validate request body
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create new user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: 'user',
      verificationToken,
      verificationTokenExpiry,
      isEmailVerified: false
    });

    // Send verification email
    await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    // Add this after sending the verification email
    console.log('Verification email sent to:', user.email);

    // Return success response without sensitive data
    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).select('-password'); // Exclude password field
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}




