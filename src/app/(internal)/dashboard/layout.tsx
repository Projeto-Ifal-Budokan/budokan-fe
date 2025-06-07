import type React from 'react';

import { ClientDashboardLayout } from '@/components/dashboard/client-dashboard-layout';
import { getSidebarItems } from '@/components/dashboard/sidebar-items';
import { cookies } from 'next/headers';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: Readonly<DashboardLayoutProps>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const items = await getSidebarItems(cookieHeader);

  return (
    <ClientDashboardLayout items={items}>{children}</ClientDashboardLayout>
  );
}
