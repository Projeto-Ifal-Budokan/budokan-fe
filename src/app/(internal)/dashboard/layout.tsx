import type React from 'react';

import { ClientDashboardLayout } from '@/components/dashboard/client-dashboard-layout';
import { getSidebarItems } from '@/components/dashboard/sidebar-items';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: Readonly<DashboardLayoutProps>) {
  const items = await getSidebarItems();

  return (
    <ClientDashboardLayout items={items}>{children}</ClientDashboardLayout>
  );
}
