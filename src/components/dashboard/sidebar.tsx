'use client';

import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/api/queries/use-auth';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
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

interface UserInfoProps {
  isCollapsed?: boolean;
}

export function UserInfo({ isCollapsed = false }: UserInfoProps) {
  const { me } = useAuth();
  const { data: user, isLoading } = me;

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center gap-3',
          isCollapsed ? 'justify-center' : ''
        )}
      >
        <Skeleton className='h-10 w-10 rounded-full bg-white/10' />
        {!isCollapsed && (
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-4 w-20 bg-white/10' />
            <Skeleton className='h-3 w-16 bg-white/10' />
          </div>
        )}
      </div>
    );
  }

  const fullName = `${user?.firstName || ''} ${user?.surname || ''}`.trim();
  const initials =
    `${user?.firstName?.charAt(0) || ''}${user?.surname?.charAt(0) || ''}`.toUpperCase();
  const roleName = user?.roles?.[0]?.name || 'Usuário';

  const avatarContent = (
    <div
      className={cn(
        'relative overflow-hidden rounded-full ring-2 ring-white/20 transition-all duration-200',
        isCollapsed ? 'h-10 w-10' : 'h-10 w-10',
        'group-hover:ring-orange-300/50'
      )}
    >
      {user?.profileImageUrl ? (
        <Avatar
          className={cn(
            'h-full w-full',
            isCollapsed ? 'h-10 w-10' : 'h-10 w-10'
          )}
        >
          <AvatarImage
            src={user.profileImageUrl}
            alt={`${fullName} avatar`}
            className='object-cover'
          />
          <AvatarFallback className='bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-semibold text-white'>
            {initials}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600'>
          {initials ? (
            <span className='text-sm font-semibold text-white'>{initials}</span>
          ) : (
            <UserCircle className='h-6 w-6 text-white' />
          )}
        </div>
      )}
      {/* Online indicator */}
      <div className='absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-blue-900 bg-green-400'></div>
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='group flex cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105'>
            {avatarContent}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side='right'
          className='border-gray-700 bg-gray-900 text-white'
        >
          <div className='text-center'>
            <p className='font-medium'>{fullName}</p>
            <p className='text-xs text-gray-300'>{roleName}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className='group flex min-w-0 flex-1 items-center gap-3'>
      {avatarContent}
      <div className='flex min-w-0 flex-1 flex-col'>
        <span className='truncate text-sm font-semibold text-white transition-colors duration-200 group-hover:text-orange-300'>
          {fullName}
        </span>
        <span className='truncate text-xs text-white/60 transition-colors duration-200 group-hover:text-white/80'>
          {roleName}
        </span>
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
    clearAuthCache();
    await logoutAction();
  };

  return (
    <div className='relative h-full'>
      {/* Sidebar */}
      <div
        className={cn(
          'group h-full overflow-hidden border-r bg-gradient-to-b from-blue-900 to-blue-950 text-white shadow-lg transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-[280px]',
          className
        )}
        {...props}
      >
        <div className='flex h-full flex-col'>
          {/* Logo */}
          <div className='flex h-16 items-center border-b border-white/10 px-4'>
            <Link href='/' className='group/logo flex items-center gap-2'>
              <div
                className={cn(
                  'flex items-center transition-transform duration-200 group-hover/logo:scale-105',
                  isCollapsed ? 'w-full justify-center' : ''
                )}
              >
                <div className='relative'>
                  <Image
                    src='/logo.jpeg'
                    alt='Budokan Logo'
                    width={40}
                    height={40}
                    className='rounded-full ring-2 ring-white/20'
                  />
                </div>
                {!isCollapsed && (
                  <span className='ml-3 text-lg font-bold text-white transition-colors duration-200 group-hover/logo:text-orange-300'>
                    Budokan-Ryu
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className='flex-1 px-2'>
            <div className='flex flex-col gap-1 py-4'>
              {items.map((item) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                      pathname === item.href
                        ? 'border border-orange-500/30 bg-orange-500/20 font-medium text-orange-300 shadow-sm'
                        : 'text-white/90 hover:bg-white/10 hover:text-orange-200',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    {IconComponent &&
                      createElement(IconComponent, {
                        className: cn(
                          'h-5 w-5 transition-transform duration-200',
                          pathname === item.href && 'scale-110'
                        ),
                      })}
                    {!isCollapsed && (
                      <span className='truncate'>{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </ScrollArea>

          {/* User Section */}
          <div className='border-t border-white/10 p-4'>
            <div
              className={cn(
                'flex items-center gap-3',
                isCollapsed ? 'justify-center' : 'justify-between'
              )}
            >
              <UserInfo isCollapsed={isCollapsed} />
              {!isCollapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={handleLogout}
                      className='h-9 w-9 text-white/70 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300'
                    >
                      <LogOut className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side='top'
                    className='border-gray-700 bg-gray-900 text-white'
                  >
                    Sair
                  </TooltipContent>
                </Tooltip>
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
