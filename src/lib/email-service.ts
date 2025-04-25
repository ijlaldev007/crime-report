import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: true
  }
});

// Verify the connection configuration
transporter.verify(function (error) {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/users/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: {
      name: 'CrimeReport',
      address: process.env.EMAIL_FROM
    },
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Hello ${name},</h1>
        <p>Thank you for registering with CrimeReport. Please verify your email address by clicking the link below:</p>
        <div style="margin: 20px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>This link will expire in 24 hours.</p>
        <p style="color: #666; font-size: 0.9em;">If you didn't create an account, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 0.8em;">This is an automated message, please do not reply.</p>
      </div>
    `,
    text: `Hello ${name},\n\nPlease verify your email address by clicking the following link:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`,
  };

  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM environment variable is not set');
    }
    await transporter.sendMail({
      ...mailOptions,
      from: {
        name: 'CrimeReport',
        address: process.env.EMAIL_FROM
      }
    });
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 0.9em;">If you didn't request this, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 0.8em;">This is an automated message, please do not reply.</p>
      </div>
    `,
    text: `You requested to reset your password. Click the following link to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
  };

  try {
    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM environment variable is not set');
    }
    await transporter.sendMail({
      ...mailOptions,
      from: {
        name: 'CrimeReport',
        address: process.env.EMAIL_FROM
      }
    });
    console.log('Password reset email sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
