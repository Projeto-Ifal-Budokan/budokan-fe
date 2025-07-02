'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Discipline } from '@/types/discipline';
import { Session } from '@/types/session';
import { Edit, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { DeleteSessionModal } from './delete-session-modal';
import { EditSessionModal } from './edit-session-modal';

interface SessionTableRowProps {
  session: Session;
  canManage: boolean;
  isAdmin: boolean;
  userDisciplines: Discipline[];
}

export function SessionTableRow({
  session,
  canManage,
  isAdmin,
  userDisciplines,
}: SessionTableRowProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Remove seconds from HH:MM:SS
  };

  return (
    <>
      <TableRow>
        <TableCell className='font-medium'>
          {session.disciplineName || `Disciplina ${session.idDiscipline}`}
        </TableCell>
        <TableCell>
          {session.instructorName || `Instrutor ${session.idInstructor}`}
        </TableCell>
        <TableCell>{formatDate(session.date)}</TableCell>
        <TableCell>
          {formatTime(session.startingTime)} - {formatTime(session.endingTime)}
        </TableCell>
        <TableCell>
          <Badge variant={session.isLastSessionOfDay ? 'default' : 'secondary'}>
            {session.isLastSessionOfDay ? 'Sim' : 'Não'}
          </Badge>
        </TableCell>
        {canManage && (
          <TableCell>
            <div className='flex items-center space-x-2'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='outline' size='icon'>
                      <UserCheck className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Gerenciar Frequência</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar Aula</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Excluir Aula</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableCell>
        )}
      </TableRow>

      <EditSessionModal
        session={session}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        isAdmin={isAdmin}
        userDisciplines={userDisciplines}
      />

      <DeleteSessionModal
        session={session}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  );
}
