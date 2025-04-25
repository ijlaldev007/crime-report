import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./rate-limit";

// Define token interface for better type safety
interface AuthToken {
    name?: string | null;
    email?: string | null;
    role?: string;
    exp?: number;
    iat?: number;
    jti?: string;
}

// Paths that require admin role
const ADMIN_PATHS = [
    '/admin',
    '/admin/users',
    '/admin/reports',
];

// Paths that require authentication
const PROTECTED_PATHS = [
    '/reports/new',
    '/profile',
];

export async function middleware(req: NextRequest) {
    try {
        // Enhanced token retrieval with secret
        const token = await getToken({ 
            req,
            secret: process.env.NEXTAUTH_SECRET 
        }) as AuthToken | null;
        
        const path = req.nextUrl.pathname;

        // Token validation
        if (token) {
            // Check token expiration
            const now = Math.floor(Date.now() / 1000);
            if (token.exp && token.exp < now) {
                return NextResponse.redirect(new URL('/login', req.url));
            }

            // Check token issue time
            if (token.iat && token.iat > now) {
                return NextResponse.redirect(new URL('/error', req.url));
            }
        }

        // Public paths handling
        if (path === '/login' || path === '/register') {
            if (token) {
                return NextResponse.redirect(new URL('/', req.url));
            }
            return addSecurityHeaders(NextResponse.next());
        }

        // Rate limiting for login attempts
        if (path === 'api/auth/callback/credentials') {
            const ratelimitResponse = await rateLimit(req);
            if (ratelimitResponse) return addSecurityHeaders(ratelimitResponse);
        }

        // Admin paths protection
        if (ADMIN_PATHS.some(p => path.startsWith(p))) {
            if (!token) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
            if (token.role !== 'admin') {
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }
        }

        // Protected paths validation
        if (PROTECTED_PATHS.some(p => path.startsWith(p))) {
            if (!token) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
        }

        // Add security headers to all responses
        return addSecurityHeaders(NextResponse.next());

    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/error', req.url));
    }
}

// Helper function to add security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
    // Basic security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // HSTS header (only in production)
    if (process.env.NODE_ENV === 'production') {
        response.headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }
    
    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );

    return response;
}

// Update matcher configuration to include all relevant paths
export const config = {
    matcher: [
        '/admin/:path*',
        '/reports/new',
        '/profile',
        '/login',
        '/register',
        '/api/auth/callback/credentials',
        '/api/:path*'
    ]
}
