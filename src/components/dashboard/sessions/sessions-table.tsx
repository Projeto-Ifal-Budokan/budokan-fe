'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { Discipline } from '@/types/discipline';
import { Session } from '@/types/session';
import { SessionTableRow } from './session-table-row';

interface SessionsTableProps {
  sessions: Session[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  canManage: boolean;
  isAdmin: boolean;
  userDisciplines: Discipline[];
}

export function SessionsTable({
  sessions,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  canManage,
  isAdmin,
  userDisciplines,
}: SessionsTableProps) {
  if (sessions.length === 0) {
    return (
      <div className='rounded-md border'>
        <div className='flex flex-col items-center justify-center py-12'>
          <p className='text-muted-foreground text-sm'>
            Nenhuma aula encontrada com os filtros aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disciplina</TableHead>
              <TableHead>Instrutor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Última Aula do Dia</TableHead>
              {canManage && <TableHead className='w-[100px]'>Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <SessionTableRow
                key={session.id}
                session={session}
                canManage={canManage}
                isAdmin={isAdmin}
                userDisciplines={userDisciplines}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        totalPages={Math.ceil(totalItems / pageSize)}
      />
    </div>
  );
}
