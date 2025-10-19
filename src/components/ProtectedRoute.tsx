// src/components/ProtectedRoute.tsx
import { redirect } from 'next/navigation';

export default function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  // Server-side: Check session
  const session = /* getSession() */;
  if (!session || (role && session.user.role !== role)) redirect('/login');
  return <>{children}</>;
}