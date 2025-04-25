import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { rateLimit } from "./rate-limit";

// Paths that require admin role

const ADMIN_PATHS = [
  '/admin',
  '/admin/users',
  '/admin/reports',
  // Add more admin paths as needed
];

// Paths that require authentication

const PROTECTED_PATHS = [
  '/reports/new',
  '/profile',
  // Add more protected paths as needed
];

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const path = req.nextUrl.pathname;

    // Handle rate limiting for login attempts

    if (path === 'api/auth/callback/credentials') {
        const ratelimitResponse = await rateLimit(req);
        if (ratelimitResponse) return ratelimitResponse;
    }

    // Public paths - allow access
    if (path === '/login' || path === '/register') {
        if (token) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next();
    }

    // Check for admin paths

    if (ADMIN_PATHS.some(p => path.startsWith(p))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (token.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
    }

    // Check for protected paths
    if (PROTECTED_PATHS.some(p => path.startsWith(p))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();


};

export const config = {
    matcher: [
        '/admin/:path*',
        '/reports/new',
        '/profile',
        '/login',
        '/register',
        '/api/auth/callback/credentials'
    ]
}
