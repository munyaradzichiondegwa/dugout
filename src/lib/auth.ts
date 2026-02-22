// src/lib/auth.ts

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Ensure you have a JWT secret set in your environment variables
const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
  throw new Error("JWT secret is not defined in environment variables");
}

// Cast once after the runtime guard — TypeScript now knows it's a string
const SECRET: string = JWT_SECRET;

// --- Types ---
export interface AuthPayload {
  userId: string;
  role: "customer" | "vendor" | "admin";
  phone?: string;
  vendorId?: string;
}

// --- JWT Utility Functions ---
export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, SECRET) as unknown as AuthPayload;
  } catch {
    return null;
  }
}

/**
 * Get authenticated user info.
 * If 'req' is provided, parse cookies from request headers.
 * Otherwise, use cookies() helper for server components.
 */
export function getAuthUser(req?: Request): AuthPayload | null {
  let token: string | undefined;

  if (req) {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookiesMap = Object.fromEntries(
      cookieHeader.split("; ").map(c => {
        const [key, val] = c.split("=");
        return [key, val];
      })
    );
    token = cookiesMap["auth-token"];
  } else {
    const cookieStore = cookies();
    token = cookieStore.get("auth-token")?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

// --- Password hashing and verification ---
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}