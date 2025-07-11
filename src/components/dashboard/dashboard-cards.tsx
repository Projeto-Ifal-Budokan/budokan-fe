import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  Settings,
  Shield,
  Trophy,
  UserCircle,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';

// Dashboard card data
const dashboardCards = [
  {
    title: 'Modalidades',
    description: 'Gerenciar modalidades e turmas',
    icon: BookOpen,
    href: '/dashboard/disciplines',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Frequência',
    description: 'Controle de presença dos alunos',
    icon: Calendar,
    href: '/dashboard/attendance',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Instrutores',
    description: 'Gerenciar instrutores e professores',
    icon: UserCircle,
    href: '/dashboard/instructors',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Usuários',
    description: 'Administrar usuários do sistema',
    icon: Users,
    href: '/dashboard/users',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Matrículas',
    description: 'Gerenciar matrículas de alunos',
    icon: GraduationCap,
    href: '/dashboard/matriculations',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Alunos',
    description: 'Gerenciar cadastro de alunos',
    icon: UserPlus,
    href: '/dashboard/students',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    title: 'Sessões',
    description: 'Gerenciar aulas e sessões',
    icon: Clock,
    href: '/dashboard/sessions',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Rankings',
    description: 'Sistema de graduações e faixas',
    icon: Trophy,
    href: '/dashboard/rankings',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    title: 'Horários',
    description: 'Cronograma de treinos',
    icon: Calendar,
    href: '/dashboard/training-schedules',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Papéis',
    description: 'Gerenciar funções do sistema',
    icon: Shield,
    href: '/dashboard/roles',
    gradient: 'from-slate-500 to-gray-600',
  },
  {
    title: 'Privilégios',
    description: 'Controle de permissões',
    icon: Settings,
    href: '/dashboard/privileges',
    gradient: 'from-stone-500 to-slate-600',
  },
  {
    title: 'Pagamentos',
    description: 'Controle financeiro e mensalidades',
    icon: CreditCard,
    href: '/dashboard/payments',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Relatórios',
    description: 'Visualizar estatísticas e relatórios',
    icon: BarChart3,
    href: '/dashboard/reports',
    gradient: 'from-teal-500 to-cyan-500',
  },
];

export function DashboardCards() {
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Acesso Rápido</h1>
        <p className='text-muted-foreground'>
          Selecione uma opção para gerenciar o sistema
        </p>
      </div>

      {/* Cards Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className='group block'>
              <Card className='relative h-full overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`}
                />
                <div className='absolute inset-0 bg-black/10' />
                <CardContent className='relative flex h-full flex-col p-6 text-white'>
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
                      <Icon className='h-6 w-6' />
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='mb-2 text-xl font-bold'>{card.title}</h3>
                    <p className='text-sm opacity-90'>{card.description}</p>
                  </div>
                  <div className='mt-4 flex items-center justify-end'>
                    <div className='mr-2 h-2 w-2 rounded-full bg-white/40' />
                    <div className='mr-2 h-2 w-2 rounded-full bg-white/60' />
                    <div className='h-2 w-2 rounded-full bg-white/80' />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
