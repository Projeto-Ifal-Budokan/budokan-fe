import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Role } from '@/types/user';
import { Shield, ShieldCheck, Users } from 'lucide-react';

interface RoleStatsCardsProps {
  roles: Role[];
}

export function RoleStatsCards({ roles }: RoleStatsCardsProps) {
  const totalRoles = roles.length;
  const systemRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes('admin') ||
      role.name.toLowerCase().includes('system')
  ).length;
  const customRoles = totalRoles - systemRoles;

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total de Papéis</CardTitle>
          <Shield className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{totalRoles}</div>
          <p className='text-muted-foreground text-xs'>Papéis no sistema</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Papéis do Sistema
          </CardTitle>
          <ShieldCheck className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{systemRoles}</div>
          <p className='text-muted-foreground text-xs'>
            Papéis administrativos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Papéis Customizados
          </CardTitle>
          <Users className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{customRoles}</div>
          <p className='text-muted-foreground text-xs'>Papéis personalizados</p>
        </CardContent>
      </Card>
    </div>
  );
}
