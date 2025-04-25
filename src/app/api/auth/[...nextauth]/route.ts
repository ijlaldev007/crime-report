import { authOptions } from "@/lib/auth/auth.config";
import NextAuth from "next-auth";
import crypto from 'crypto';

// Enhanced JWT configuration
const handler = NextAuth({
    ...authOptions,
    jwt: {
        ...authOptions.jwt,
        // Maximum age of the token
        maxAge: 24 * 60 * 60, // 24 hours
        // Add additional security options
        secret: process.env.NEXTAUTH_SECRET,
        encode: async ({ token }) => {
            if (!token) return "";
            // Convert token to base64 string
            const tokenString = JSON.stringify(token);
            return Buffer.from(tokenString).toString('base64');
        },
        decode: async ({  token }) => {
            if (!token) return null;
            try {
                // Decode base64 string back to token
                const decoded = Buffer.from(token, 'base64').toString();
                return JSON.parse(decoded);
            } catch (error) {
                console.error('Token decode error:', error);
                return null;
            }
        },
    },
    callbacks: {
        ...authOptions.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.email_verified = user.isEmailVerified;
            }

            // Enhanced security with additional claims
            token.iat = Math.floor(Date.now() / 1000);
            token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
            token.jti = crypto.randomUUID();
            token.nonce = crypto.randomBytes(16).toString('hex'); // Add nonce for extra security

            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.email_verified = token.email_verified as boolean;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
        updateAge: 60 * 60, // 1 hour
    },
    pages: {
        signIn: '/login',
        error: '/error',
        verifyRequest: '/verify-request',
    }
});

export { handler as GET, handler as POST };






