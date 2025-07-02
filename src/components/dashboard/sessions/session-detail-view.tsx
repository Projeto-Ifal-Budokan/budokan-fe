'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/api/queries/use-auth';
import { usePrivilegesByUser } from '@/lib/api/queries/use-privileges';
import { hasAccess } from '@/utils/access-control';
import { ArrowLeft, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { SessionAttendanceManagement } from './session-attendance-management';

interface SessionDetailViewProps {
  sessionId: string;
}

export function SessionAttendanceDetailView({
  sessionId,
}: SessionDetailViewProps) {
  // Hooks
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  // Computed values
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  const canEdit = isAdmin; // For now, only admin can edit

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link href='/dashboard/sessions'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className='text-2xl font-bold'>Controle de Frequência</h1>
            <p className='text-gray-600'>
              Gerencie a frequência dos alunos na aula
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Management */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <UserCheck className='h-5 w-5' />
            Lista de Frequência - Aula #{sessionId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SessionAttendanceManagement
            sessionId={sessionId}
            canManage={canEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
