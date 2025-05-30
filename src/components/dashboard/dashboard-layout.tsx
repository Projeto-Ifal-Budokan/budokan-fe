import type React from 'react';

import { Breadcrumb } from '@/components/dashboard/breadcrumb';
// import { Sidebar } from '@/components/dashboard/sidebar';

import { ClientDashboardLayout } from './client-dashboard-layout';
import { getSidebarItems } from './sidebar-items';

interface DashboardLayoutProps {
  children: React.ReactNode;
  cookies: string;
}

// This is now a Server Component (no 'use client')
export async function DashboardLayout({
  children,
  cookies,
}: DashboardLayoutProps) {
  // Fetch sidebar items on the server
  const items = await getSidebarItems(cookies);

  return (
    <ClientDashboardLayout items={items}>
      <div className='p-4 md:p-6'>
        <Breadcrumb />
        <div className='mt-4'>{children}</div>
      </div>
    </ClientDashboardLayout>
  );
}
