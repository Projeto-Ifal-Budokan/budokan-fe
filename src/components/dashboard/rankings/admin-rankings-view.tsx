'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Award,
  BookOpen,
  Edit,
  Eye,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { CreateRankingDialog } from './create-ranking-dialog';
import { RankingDetailDialog } from './detail-ranking-dialog';
import { EditRankingDialog } from './edit-ranking-dialog';

// Types based on API response
interface Ranking {
  id: number;
  idDiscipline: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  disciplineName: string;
}

interface Discipline {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export function AdminRankingsView() {
  const [selectedRanking, setSelectedRanking] = useState<Ranking | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRanking, setEditingRanking] = useState<Ranking | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Mock data based on API structure
  const disciplines: Discipline[] = [
    {
      id: 1,
      name: 'Karate-Do',
      description: 'Modalidade de Karate-Do',
      status: 'active',
    },
    {
      id: 2,
      name: 'Kendo',
      description: 'Modalidade de Kendo',
      status: 'active',
    },
    {
      id: 3,
      name: 'Arqueria',
      description: 'Modalidade de Arqueria',
      status: 'active',
    },
  ];

  const rankings: Ranking[] = [
    {
      id: 1,
      idDiscipline: 1,
      name: '7º Kyu',
      description: 'Faixa Branca',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 2,
      idDiscipline: 1,
      name: '6º Kyu',
      description: 'Faixa Amarela',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 3,
      idDiscipline: 1,
      name: '5º Kyu',
      description: 'Faixa Laranja',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 4,
      idDiscipline: 1,
      name: '4º Kyu',
      description: 'Faixa Verde',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 5,
      idDiscipline: 1,
      name: '3º Kyu',
      description: 'Faixa Roxa',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 6,
      idDiscipline: 1,
      name: '2º Kyu',
      description: 'Faixa Marrom',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 7,
      idDiscipline: 1,
      name: '1º Kyu',
      description: 'Faixa Marrom',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 8,
      idDiscipline: 1,
      name: '1º Dan',
      description: 'Faixa Preta',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 9,
      idDiscipline: 2,
      name: '6º Kyu',
      description: 'Faixa Branca',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Kendo',
    },
    {
      id: 10,
      idDiscipline: 2,
      name: '5º Kyu',
      description: 'Faixa Azul',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Kendo',
    },
  ];

  const filteredRankings = rankings.filter(
    (ranking) =>
      ranking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ranking.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ranking.disciplineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankingStats = (rankingId: number) => {
    // Mock stats - in real app, this would come from API
    return {
      totalStudents: Math.floor(Math.random() * 50) + 1,
      activeStudents: Math.floor(Math.random() * 30) + 1,
    };
  };

  const getBeltColor = (description: string) => {
    const colorMap: { [key: string]: string } = {
      'Faixa Branca': 'bg-gray-100 text-gray-800',
      'Faixa Amarela': 'bg-yellow-100 text-yellow-800',
      'Faixa Laranja': 'bg-orange-100 text-orange-800',
      'Faixa Verde': 'bg-green-100 text-green-800',
      'Faixa Roxa': 'bg-purple-100 text-purple-800',
      'Faixa Marrom': 'bg-amber-100 text-amber-800',
      'Faixa Preta': 'bg-gray-900 text-white',
      'Faixa Azul': 'bg-blue-100 text-blue-800',
    };
    return colorMap[description] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = (ranking: Ranking) => {
    setEditingRanking(ranking);
    setShowEditDialog(true);
  };

  const handleDelete = (ranking: Ranking) => {
    // TODO: Implement delete functionality
    console.log('Delete ranking:', ranking);
  };

  const handleView = (ranking: Ranking) => {
    setSelectedRanking(ranking);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Gerenciamento de Rankings
          </h1>
          <p className='text-gray-600'>
            Gerencie os níveis de graduação das modalidades
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className='bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'
        >
          <PlusCircle className='mr-2 h-4 w-4' />
          Novo Ranking
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total de Rankings
            </CardTitle>
            <Trophy className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{rankings.length}</div>
            <p className='text-xs text-gray-600'>
              Rankings cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Modalidades</CardTitle>
            <BookOpen className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{disciplines.length}</div>
            <p className='text-xs text-gray-600'>Modalidades com rankings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Ranking Mais Alto
            </CardTitle>
            <Award className='h-4 w-4 text-yellow-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>3º Dan</div>
            <p className='text-xs text-gray-600'>Karate-Do</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center space-x-2'>
            <div className='relative flex-1'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Buscar rankings...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          {/* Rankings List */}
          <div className='space-y-4'>
            {filteredRankings.map((ranking) => {
              const stats = getRankingStats(ranking.id);
              return (
                <div
                  key={ranking.id}
                  className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-3'>
                      <Trophy className='h-8 w-8 text-blue-600' />
                      <div>
                        <h3 className='font-semibold text-gray-900'>
                          {ranking.name}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {ranking.description}
                        </p>
                        <div className='mt-1 flex items-center space-x-2'>
                          <Badge variant='outline' className='text-xs'>
                            {ranking.disciplineName}
                          </Badge>
                          <Badge
                            className={`text-xs ${getBeltColor(ranking.description)}`}
                          >
                            {ranking.description}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='text-right'>
                      <div className='text-sm text-gray-600'>
                        {stats.totalStudents} alunos
                      </div>
                      <div className='text-xs text-gray-500'>
                        {stats.activeStudents} ativos
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleView(ranking)}>
                          <Eye className='mr-2 h-4 w-4' />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(ranking)}>
                          <Edit className='mr-2 h-4 w-4' />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(ranking)}
                          className='text-red-600'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRankings.length === 0 && (
            <div className='py-8 text-center'>
              <Trophy className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                Nenhum ranking encontrado
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {searchTerm
                  ? 'Tente ajustar os termos de busca.'
                  : 'Comece criando um novo ranking.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {showCreateDialog && (
        <CreateRankingDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          disciplines={disciplines}
        />
      )}

      {showEditDialog && editingRanking && (
        <EditRankingDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          ranking={editingRanking}
          disciplines={disciplines}
        />
      )}

      {selectedRanking && (
        <RankingDetailDialog
          open={!!selectedRanking}
          onOpenChange={() => setSelectedRanking(null)}
          ranking={selectedRanking}
        />
      )}
    </div>
  );
}
