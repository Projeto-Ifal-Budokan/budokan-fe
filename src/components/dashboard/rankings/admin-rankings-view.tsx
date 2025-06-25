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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { rankingsService } from '@/lib/api/services/rankings-service';
import { Ranking } from '@/types/ranking';
import {
  BookOpen,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateRankingDialog } from './create-ranking-dialog';
import { RankingDetailDialog } from './detail-ranking-dialog';
import { EditRankingDialog } from './edit-ranking-dialog';

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
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [editingRanking, setEditingRanking] = useState<Ranking | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for disciplines - in real app, this would come from API
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

  // Load rankings from API
  const loadRankings = async (disciplineId?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rankingsService.getRankings(disciplineId);

      if (response.ok) {
        setRankings(response.data);
      } else {
        setError('Erro ao carregar rankings');
        console.error('Failed to load rankings:', response.status);
      }
    } catch (error) {
      setError('Erro ao carregar rankings');
      console.error('Error loading rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load rankings on component mount
  useEffect(() => {
    loadRankings();
  }, []);

  // Load rankings when discipline filter changes
  //TODO: fetch it from API
  useEffect(() => {
    if (selectedDiscipline === 'all') {
      loadRankings();
    } else {
      const discipline = disciplines.find((d) => d.name === selectedDiscipline);
      if (discipline) {
        loadRankings(discipline.id.toString());
      }
    }
  }, [selectedDiscipline]);

  const filteredRankings = rankings.filter((ranking) => {
    // Filtro por termo de busca
    const matchesSearch =
      ranking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ranking.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ranking.disciplineName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

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

  const handleDelete = async (ranking: Ranking) => {
    try {
      const response = await rankingsService.deleteRanking(
        ranking.id.toString()
      );

      if (response.ok) {
        // Reload rankings after successful deletion
        loadRankings(
          selectedDiscipline === 'all' ? undefined : selectedDiscipline
        );
      } else {
        console.error('Failed to delete ranking:', response.status);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error('Error deleting ranking:', error);
      // TODO: Show error message to user
    }
  };

  const handleView = (ranking: Ranking) => {
    setSelectedRanking(ranking);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDiscipline('all');
  };

  const hasActiveFilters = searchTerm || selectedDiscipline !== 'all';

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    // Reload rankings after successful creation
    loadRankings(selectedDiscipline === 'all' ? undefined : selectedDiscipline);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    // Reload rankings after successful edit
    loadRankings(selectedDiscipline === 'all' ? undefined : selectedDiscipline);
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Gerenciamento de Rankings
            </h1>
            <p className='text-gray-600'>
              Gerencie os níveis de graduação das modalidades
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <p className='mt-2 text-gray-600'>Carregando rankings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Gerenciamento de Rankings
            </h1>
            <p className='text-gray-600'>
              Gerencie os níveis de graduação das modalidades
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <p className='mb-4 text-red-600'>{error}</p>
            <Button onClick={() => loadRankings()}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Rankings</CardTitle>
            <div className='bg-muted flex space-x-1 rounded-lg p-1'>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('table')}
              >
                Tabela
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-4 space-y-4'>
            {/* Search and Filter Controls */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
              <div className='relative flex-1'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='Buscar rankings...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>

              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4 text-gray-400' />
                <Select
                  value={selectedDiscipline}
                  onValueChange={setSelectedDiscipline}
                >
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder='Filtrar por modalidade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Todas as modalidades</SelectItem>
                    {disciplines
                      .filter((discipline) => discipline.status === 'active')
                      .map((discipline) => (
                        <SelectItem key={discipline.id} value={discipline.name}>
                          {discipline.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button
                  variant='outline'
                  onClick={clearFilters}
                  className='text-sm'
                >
                  Limpar filtros
                </Button>
              )}
            </div>

            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <span>Filtros ativos:</span>
                {searchTerm && (
                  <Badge variant='secondary' className='text-xs'>
                    Busca: &quot;{searchTerm}&quot;
                  </Badge>
                )}
                {selectedDiscipline !== 'all' && (
                  <Badge variant='secondary' className='text-xs'>
                    Modalidade: {selectedDiscipline}
                  </Badge>
                )}
                <span className='text-gray-500'>
                  ({filteredRankings.length} de {rankings.length} resultados)
                </span>
              </div>
            )}
          </div>

          {/* Content based on view mode */}
          {viewMode === 'cards' ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredRankings.map((ranking) => {
                const stats = getRankingStats(ranking.id);
                return (
                  <Card
                    key={ranking.id}
                    className='transition-shadow hover:shadow-md'
                  >
                    <CardHeader>
                      <div className='flex items-start gap-4'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                          <Trophy className='h-6 w-6 text-blue-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-start justify-between'>
                            <div>
                              <CardTitle className='text-lg'>
                                {ranking.name}
                              </CardTitle>
                              <CardTitle className='text-sm text-gray-600'>
                                {ranking.disciplineName}
                              </CardTitle>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm'>
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                  onClick={() => handleView(ranking)}
                                >
                                  <Eye className='mr-2 h-4 w-4' />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEdit(ranking)}
                                >
                                  <Edit className='mr-2 h-4 w-4' />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(ranking)}
                                  className='text-destructive'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div>
                          <Badge
                            className={`w-full justify-center ${getBeltColor(ranking.description)}`}
                          >
                            {ranking.description}
                          </Badge>
                        </div>

                        <div className='grid grid-cols-2 gap-4 border-t pt-4'>
                          <div className='text-center'>
                            <div className='text-lg font-bold'>
                              {stats.totalStudents}
                            </div>
                            <div className='text-muted-foreground text-xs'>
                              Total de Alunos
                            </div>
                          </div>
                          <div className='text-center'>
                            <div className='text-lg font-bold'>
                              {stats.activeStudents}
                            </div>
                            <div className='text-muted-foreground text-xs'>
                              Alunos Ativos
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
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
          )}

          {filteredRankings.length === 0 && (
            <div className='py-8 text-center'>
              <Trophy className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                Nenhum ranking encontrado
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {hasActiveFilters
                  ? 'Tente ajustar os filtros aplicados.'
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
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditDialog && editingRanking && (
        <EditRankingDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          ranking={editingRanking}
          disciplines={disciplines}
          onSuccess={handleEditSuccess}
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
