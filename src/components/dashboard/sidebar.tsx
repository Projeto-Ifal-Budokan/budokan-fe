'use client';

import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/api/queries/useAuth';

import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LogOut,
  UserCircle,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Mock user data - in a real app, this would come from authentication
// const user = {
//   name: 'João Silva',
//   role: 'Administrador',
//   avatar: '/placeholder.svg?height=32&width=32',
// };

// Navigation items
const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Modalidades',
    href: '/dashboard/disciplines',
    icon: BookOpen,
  },
  {
    title: 'Frequência',
    href: '/dashboard/attendance',
    icon: Calendar,
  },
  {
    title: 'Instrutores',
    href: '/dashboard/instructors',
    icon: UserCircle,
  },
  {
    title: 'Usuários',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Alunos',
    href: '/dashboard/students',
    icon: Users,
  },
  {
    title: 'Pagamentos',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
  {
    title: 'Relatórios',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
];

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
        <span className='text-xs text-white/70'>
          {user?.roles[0]?.name || 'Usuário'}
        </span>
      </div>
    </div>
  );
}

export default function Sidebar({
  className,
  isCollapsed,
  onToggle,
  ...props
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className='relative h-full'>
      {/* Sidebar */}
      <div
        className={cn(
          'group h-full overflow-hidden border-r bg-blue-900 text-white transition-all duration-300',
          isCollapsed ? 'w-[70px]' : 'w-[240px]',
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
              {navItems.map((item) => (
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
                  <item.icon
                    className={cn('h-4 w-4', isCollapsed && 'h-5 w-5')}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
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
                <LogOut
                  className='h-4 w-4 text-white/70 hover:text-orange-300'
                  onClick={() => {
                    logoutAction();
                  }}
                />
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
