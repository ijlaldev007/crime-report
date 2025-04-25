import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

const ipAttempts = new Map<string, number[]>();

export function rateLimit(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0] ?? '127.0.0.1';
  const now = Date.now();
  
  const attempts = ipAttempts.get(ip) ?? [];
  const recentAttempts = attempts.filter(time => now - time < WINDOW_SIZE);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many login attempts. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  recentAttempts.push(now);
  ipAttempts.set(ip, recentAttempts);
  
  return NextResponse.next();
}