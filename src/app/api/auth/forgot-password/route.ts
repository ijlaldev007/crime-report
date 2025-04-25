import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { User } from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await User.findOne({ email });
    
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiry = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
      
      await sendPasswordResetEmail(email, resetToken);
    }
    
    // Always return success to prevent email enumeration
    return NextResponse.json({ 
      message: 'If an account exists, a password reset email has been sent.' 
    });
  } catch (error: unknown) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}