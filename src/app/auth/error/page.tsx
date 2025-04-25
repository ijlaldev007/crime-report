'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const errorMessages = {
  'Missing credentials': 'Please provide both email and password.',
  'Invalid credentials': 'Invalid email or password.',
  'Email not verified': 'Please verify your email before logging in.',
  'Invalid session': 'Your session has expired. Please log in again.',
  'Default': 'An unexpected error occurred. Please try again.'
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    const message = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;
    toast.error(message);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Authentication Error</h2>
        <p className="text-center text-gray-600">
          {errorMessages[error as keyof typeof errorMessages] || errorMessages.Default}
        </p>
        <div className="text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-500">
            Return to login
          </a>
        </div>
      </div>
    </div>
  );
}