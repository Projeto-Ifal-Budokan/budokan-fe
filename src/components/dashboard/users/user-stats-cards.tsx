import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/user';
import { Users } from 'lucide-react';

interface UserStatsCardsProps {
  users: User[] | undefined;
}

export function UserStatsCards({ users }: UserStatsCardsProps) {
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Total Usuários
          </CardTitle>
          <Users className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>{users?.length || 0}</div>
          <p className='mt-1 text-xs opacity-80'>
            {users?.filter((u) => u.status === 'active').length || 0} ativos
          </p>
        </CardContent>
      </Card>

      {/* <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Administradores
          </CardTitle>
          <Shield className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>3</div>
          <p className='mt-1 text-xs opacity-80'>usuários admin</p>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Instrutores
          </CardTitle>
          <UserCheck className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>12</div>
          <p className='mt-1 text-xs opacity-80'>instrutores cadastrados</p>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl'>
        <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10'></div>
        <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium opacity-90'>
            Funcionários
          </CardTitle>
          <Users className='h-5 w-5 opacity-80' />
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-3xl font-bold'>8</div>
          <p className='mt-1 text-xs opacity-80'>funcionários ativos</p>
        </CardContent>
      </Card> */}
    </div>
  );
}
