import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email_verified: boolean;
    } & DefaultSession["user"]
  }

  interface User {
    role: string;
    isEmailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    email_verified: boolean;
    exp: number;
    iat: number;
    jti: string;
  }
}


