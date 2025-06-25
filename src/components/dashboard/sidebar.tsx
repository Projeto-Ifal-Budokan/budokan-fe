'use client';

import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/api/queries/use-auth';

import { cn } from '@/lib/utils';
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Key,
  LogOut,
  LucideIcon,
  Shield,
  Trophy,
  User,
  UserCheck,
  UserCircle,
  UserPlus,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createElement, HTMLAttributes } from 'react';
import { SidebarItem } from './sidebar-items';

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  onToggle: () => void;
  items: SidebarItem[];
}

// Add this icon mapping object
const iconMap: { [key: string]: LucideIcon } = {
  Home,
  BookOpen,
  Calendar,
  UserCheck,
  Clock,
  Users,
  Trophy,
  User,
  Shield,
  Key,
  UserPlus,
};

export function UserInfo() {
  const { me } = useAuth();
  const { data: user, isLoading } = me;

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='relative h-7 w-7 overflow-hidden rounded-full'>
        {/* {user.avatar ? (
          <Image
            src={user.avatar}
            alt={`${me.data?.firstName} ${me.data?.surname}`}
            fill
            className='object-cover'
          />
        ) : ( */}
        <UserCircle className='h-full w-full text-white/70' />
        {/* )} */}
      </div>
      <div className='flex flex-col'>
        <span className='text-sm font-medium text-orange-300'>
          {user?.firstName} {user?.surname}
        </span>
        {/* <span className='text-xs text-white/70'>
          {user?.roles[0]?.name || 'Usuário'}
        </span> */}
      </div>
    </div>
  );
}

export default function Sidebar({
  className,
  isCollapsed,
  onToggle,
  items,
  ...props
}: SidebarProps) {
  const { clearAuthCache } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    clearAuthCache(); // Clear the cache before logging out
    await logoutAction();
  };

  return (
    <div className='relative h-full'>
      {/* Sidebar */}
      <div
        className={cn(
          'group h-full overflow-hidden border-r bg-blue-900 text-white transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-[240px]',
          className
        )}
        {...props}
      >
        <div className='flex h-full flex-col'>
          {/* Logo */}
          <div className='flex h-16 items-center border-b px-3'>
            <Link href='/' className='flex items-center gap-2'>
              <div
                className={cn(
                  'flex items-center',
                  isCollapsed ? 'w-full justify-center' : ''
                )}
              >
                <Image
                  src='/logo.jpeg'
                  alt='Budokan Logo'
                  width={50}
                  height={50}
                  className='rounded-full'
                />
                {!isCollapsed && (
                  <span className='ml-2 text-lg font-bold text-white'>
                    Budokan-Ryu
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className='flex-1 px-1'>
            <div className='flex flex-col gap-0.5 py-2'>
              {items.map((item) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      pathname === item.href
                        ? 'bg-primary-foreground/10 text-primary font-medium'
                        : 'hover:bg-primary-foreground/10 hover:text-primary/80 text-white',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    {IconComponent &&
                      createElement(IconComponent, {
                        className: cn('h-4 w-4', isCollapsed && 'h-5 w-5'),
                      })}
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </ScrollArea>

          <div className='border-t p-3'>
            <div
              className={cn(
                'flex items-center justify-between gap-2',
                isCollapsed && 'justify-center'
              )}
            >
              <UserInfo />
              {!isCollapsed && (
                <Button variant='ghost' size='icon' onClick={handleLogout}>
                  <LogOut className='h-4 w-4 text-white/70 hover:text-orange-300' />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapse button positioned outside the sidebar */}
      <Button
        variant='secondary'
        size='icon'
        className='border-border bg-background absolute top-6 -right-3 z-10 h-6 w-6 rounded-full border p-0 shadow-md'
        onClick={onToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className='text-primary h-3 w-3' />
        ) : (
          <ChevronLeft className='text-primary h-3 w-3' />
        )}
      </Button>
    </div>
  );
}
