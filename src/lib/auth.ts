// src/lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

// Ensure you have a JWT secret
const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("NEXTAUTH_SECRET or JWT_SECRET is not defined in .env");

// --- Types ---
export interface AuthPayload {
  userId: string;
  role: "customer" | "vendor" | "admin";
  phone?: string;
}

// --- JWT Utilities ---
export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

// --- Cookie-based Auth Helper ---
export function getAuthUser(): AuthPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// --- Password Utilities ---
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// --- NextAuth Options ---
export const authOptions: NextAuthOptions = {
  secret: JWT_SECRET,
  session: { strategy: "jwt" },
  providers: [
    // Add your authentication providers here, e.g. Google, Credentials, etc.
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = (token as any).role;
      return session;
    },
  },
};
