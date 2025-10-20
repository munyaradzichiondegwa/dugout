import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

interface AppUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: 'admin' | 'customer' | 'vendor'; // add your roles
}

interface AppSession extends Session {
  user: AppUser;
}

export default async function AdminDashboardPage() {
  const session = (await getServerSession()) as AppSession;

  if (!session?.user?.role || session.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  return <div>Admin Dashboard</div>;
}
