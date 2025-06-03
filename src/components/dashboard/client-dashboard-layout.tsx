'use client';

import type React from 'react';

// import { Sidebar } from '@/components/dashboard/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import { type SidebarItem } from './sidebar-items';

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
  items: SidebarItem[];
}

export function ClientDashboardLayout({
  children,
  items,
}: ClientDashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-collapse sidebar on medium screens but not mobile
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        // Expand sidebar on larger screens by default
        setIsCollapsed(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className='flex min-h-screen overflow-hidden bg-gray-100'>
      {/* Desktop Sidebar */}
      <div className='hidden lg:block'>
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
          items={items}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='bg-primary hover:bg-primary/90 fixed top-3 left-4 z-30 text-white lg:hidden'
          >
            <Menu className='h-6 w-6' />
          </Button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='bg-primary w-[280px] max-w-full border-r-0 p-0 text-white'
        >
          <Sidebar isCollapsed={false} onToggle={() => {}} items={items} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out',
          isMobile ? 'w-full' : isCollapsed ? 'lg:ml-[20px]' : 'lg:ml-[30px]'
        )}
      >
        {children}
      </main>
    </div>
  );
}
