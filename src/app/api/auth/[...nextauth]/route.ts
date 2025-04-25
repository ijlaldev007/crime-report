import NextAuth, { NextAuthOptions } from "next-auth";
import type { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import clientPromise from "@/lib/mongodb-client";

// Initialize MongoDB connection
connectToDatabase();

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email_verified: boolean;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    email_verified: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  // @ts-expect-error - Known issue with MongoDB adapter types
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          if (!user.isEmailVerified) {
            throw new Error("Email not verified");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
            isEmailVerified: user.isEmailVerified
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error; // Will be handled by NextAuth
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user }) {
      return Boolean(user?.isEmailVerified);
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email_verified = user.isEmailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.email_verified = token.email_verified;
      }
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token.email}`);
    },
    async session({ session, token }) {
      try {
        // Validate session
        if (!token || !session) {
          throw new Error("Invalid session");
        }
        // Don't return the session, just validate it
      } catch (error) {
        console.error("Session error:", error);
        throw error;
      }
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error', // Custom error page
    signOut: '/auth/signout'
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



