'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string;
}

interface SessionUser {
  role: string;
}

interface Session {
  user: SessionUser;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const router = useRouter();

  // TODO: Replace with real session logic (e.g. useSession from next-auth)
  const session = null as Session | null;

  if (!session || (role && session.user.role !== role)) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}