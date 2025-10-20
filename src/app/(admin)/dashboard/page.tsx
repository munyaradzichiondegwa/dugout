// Server component wrapper
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { fetchVendors, fetchRecentOrders } from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardWrapper() {
  const session = await getServerSession();

  if (!session?.user?.role || session.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  // Fetch server-side
  const vendors = await fetchVendors({ verified: false });
  const recentOrders = await fetchRecentOrders(10);

  return <AdminDashboardClient vendors={vendors} recentOrders={recentOrders} />;
}
