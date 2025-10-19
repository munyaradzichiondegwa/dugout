'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string;
}

// Temporary session type
type Session = { user: { role: string } } | null;

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const router = useRouter();

  // TODO: Replace with real session logic
  const session: Session = null; // e.g., replace with getSession() later

  if (!session || (role && session.user.role !== role)) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}
