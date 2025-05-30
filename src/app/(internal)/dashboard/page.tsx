import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return (
    <DashboardLayout cookies={cookieHeader}>
      <h1 className='mb-6 text-2xl font-bold'>Dashboard</h1>
      <DashboardCards />
    </DashboardLayout>
  );
}
