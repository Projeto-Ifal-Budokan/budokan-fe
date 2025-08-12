'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useManageRankings } from '@/lib/api/queries/use-manage-rankings';
import { Discipline, Rank } from '@/types/discipline';
import { Award, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AddRankToDisciplineModal } from './modals/add-rank-to-discipline-modal';
import { DeleteRankModal } from './modals/delete-rank-modal';

interface DisciplineRanksTabProps {
  discipline: Discipline;
}

export function DisciplineRanksTab({ discipline }: DisciplineRanksTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<Rank | null>(null);
  const [deletingRank, setDeletingRank] = useState<Rank | null>(null);

  const { useRankings } = useManageRankings();
  const { data: ranks } = useRankings(1, 1000, {
    disciplineId: String(discipline.id),
  });

  const getBeltColor = (description: string) => {
    const colors: { [key: string]: string } = {
      'Faixa Branca': 'bg-gray-100 text-gray-800 border-gray-300',
      'Faixa Amarela': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Faixa Laranja': 'bg-orange-100 text-orange-800 border-orange-300',
      'Faixa Verde': 'bg-green-100 text-green-800 border-green-300',
      'Faixa Roxa': 'bg-purple-100 text-purple-800 border-purple-300',
      'Faixa Marrom': 'bg-amber-100 text-amber-800 border-amber-300',
      'Faixa Preta': 'bg-gray-900 text-white border-gray-700',
    };
    return colors[description] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Ranks da Disciplina
          </h3>
          <p className='text-sm text-gray-600'>
            Gerencie as Ranks e rankings desta disciplina
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className='bg-gradient-to-r from-emerald-600 to-teal-600'
        >
          <Plus className='mr-2 h-4 w-4' />
          Adicionar Rank
        </Button>
      </div>

      {ranks?.data.count === 0 ? (
        <Card className='border-2 border-dashed border-gray-200'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Award className='mb-4 h-12 w-12 text-gray-400' />
            <h4 className='mb-2 text-lg font-medium text-gray-900'>
              Nenhuma Rank cadastrada
            </h4>
            <p className='mb-6 text-center text-gray-600'>
              Esta disciplina ainda não possui Ranks definidas. Adicione a
              primeira Rank para começar.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className='bg-gradient-to-r from-emerald-600 to-teal-600'
            >
              <Plus className='mr-2 h-4 w-4' />
              Adicionar Rank
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Award className='h-5 w-5 text-emerald-600' />
              Ranks ({ranks?.data.count})
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50/50'>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição/Faixa</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranks?.data.items.map((rank) => (
                  <TableRow key={rank.id}>
                    <TableCell className='font-medium'>{rank.name}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getBeltColor(rank.description)}`}
                      >
                        {rank.description}
                      </div>
                    </TableCell>
                    <TableCell className='text-gray-600'>
                      {new Date(rank.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        {/* <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setEditingRank(rank)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button> */}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setDeletingRank(rank)}
                          className='text-red-600 hover:bg-red-50 hover:text-red-700'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddRankToDisciplineModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        disciplineId={String(discipline.id)}
        disciplineName={discipline.name}
      />

      {deletingRank && (
        <DeleteRankModal
          isOpen={!!deletingRank}
          onOpenChange={(open) => !open && setDeletingRank(null)}
          rank={deletingRank}
        />
      )}
    </>
  );
}
