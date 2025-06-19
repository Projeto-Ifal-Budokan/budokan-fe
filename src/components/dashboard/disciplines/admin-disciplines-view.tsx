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
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { CreateModalidadeDialog } from './create-disciplines-dialog';
import { ModalidadeDetailDialog } from './detail-disciplines-dialog';
import { EditModalidadeDialog } from './edit-disciplines-dialog';
// import { CreateModalidadeDialog } from './create-modalidade-dialog';
// import { EditModalidadeDialog } from './edit-modalidade-dialog';
// import { ModalidadeDetailDialog } from './modalidade-detail-dialog';

// Types based on API response
interface Modalidade {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Rank {
  id: number;
  idDiscipline: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  disciplineName: string;
}

interface InstructorDiscipline {
  id: number;
  idInstructor: number;
  idDiscipline: number;
  idRank: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export function AdminDisciplinesView() {
  const [selectedModalidade, setSelectedModalidade] =
    useState<Modalidade | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingModalidade, setEditingModalidade] = useState<Modalidade | null>(
    null
  );
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Mock data based on API structure
  const modalidades: Modalidade[] = [
    {
      id: 1,
      name: 'Karate-Do',
      description: 'Modalidade de Karate-Do',
      status: 'active',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
    },
    {
      id: 2,
      name: 'Kendo',
      description: 'Modalidade de Kendo',
      status: 'active',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
    },
    {
      id: 3,
      name: 'Arqueria',
      description: 'Modalidade de Arqueria',
      status: 'active',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
    },
  ];

  const ranks: Rank[] = [
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
      idDiscipline: 1,
      name: '2º Dan',
      description: 'Faixa Preta',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
    {
      id: 10,
      idDiscipline: 1,
      name: '3º Dan',
      description: 'Faixa Preta',
      createdAt: '2025-06-06T12:58:43.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
      disciplineName: 'Karate-Do',
    },
  ];

  const instructorDisciplines: InstructorDiscipline[] = [
    {
      id: 1,
      idInstructor: 2,
      idDiscipline: 1,
      idRank: 10,
      status: 'active',
      // activatedBy: null,
      // inactivatedBy: null,
      createdAt: '2025-06-06T12:58:44.000Z',
      updatedAt: '2025-06-06T12:58:44.000Z',
    },
  ];

  const filteredModalidades = modalidades.filter(
    (modalidade) =>
      modalidade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modalidade.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModalidadeStats = (modalidadeId: number) => {
    const modalidadeRanks = ranks.filter(
      (rank) => rank.idDiscipline === modalidadeId
    );
    const modalidadeInstructors = instructorDisciplines.filter(
      (inst) => inst.idDiscipline === modalidadeId
    );

    return {
      totalRanks: modalidadeRanks.length,
      totalInstructors: modalidadeInstructors.length,
      activeInstructors: modalidadeInstructors.filter(
        (inst) => inst.status === 'active'
      ).length,
    };
  };

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
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Gerenciar Modalidades</h1>
          <p className='text-muted-foreground'>
            Controle completo sobre modalidades, ranks e instrutores
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusCircle className='mr-2 h-4 w-4' />
          Nova Modalidade
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Modalidades
            </CardTitle>
            <BookOpen className='h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{modalidades.length}</div>
            <p className='text-muted-foreground text-xs'>
              {modalidades.filter((m) => m.status === 'active').length} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Ranks</CardTitle>
            <Award className='h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{ranks.length}</div>
            <p className='text-muted-foreground text-xs'>
              Graduações cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Instrutores Ativos
            </CardTitle>
            <Users className='h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                instructorDisciplines.filter((inst) => inst.status === 'active')
                  .length
              }
            </div>
            <p className='text-muted-foreground text-xs'>
              Lecionando atualmente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Cobertura</CardTitle>
            <TrendingUp className='h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>100%</div>
            <p className='text-muted-foreground text-xs'>
              Modalidades com instrutor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className='flex items-center space-x-2'>
        <div className='relative max-w-sm flex-1'>
          <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
          <Input
            placeholder='Buscar modalidades...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-8'
          />
        </div>
      </div>

      {/* Modalidades Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        {filteredModalidades.map((modalidade) => {
          const stats = getModalidadeStats(modalidade.id);
          const modalidadeRanks = ranks.filter(
            (rank) => rank.idDiscipline === modalidade.id
          );

          return (
            <Card
              key={modalidade.id}
              className='transition-all duration-200 hover:shadow-lg'
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>{modalidade.name}</CardTitle>
                    <p className='text-muted-foreground text-sm'>
                      {modalidade.description}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge
                      variant={
                        modalidade.status === 'active' ? 'default' : 'secondary'
                      }
                      className={
                        modalidade.status === 'active'
                          ? 'border-green-300 bg-green-100 text-green-800'
                          : ''
                      }
                    >
                      {modalidade.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => setSelectedModalidade(modalidade)}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingModalidade(modalidade);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className='mr-2 h-4 w-4' />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-red-600'>
                          <Trash2 className='mr-2 h-4 w-4' />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Stats */}
                <div className='grid grid-cols-3 gap-4 text-center'>
                  <div>
                    <div className='text-lg font-bold'>{stats.totalRanks}</div>
                    <div className='text-muted-foreground text-xs'>Ranks</div>
                  </div>
                  <div>
                    <div className='text-lg font-bold'>
                      {stats.activeInstructors}
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      Instrutores
                    </div>
                  </div>
                  <div>
                    <div className='text-lg font-bold'>
                      {new Date(modalidade.createdAt).getFullYear()}
                    </div>
                    <div className='text-muted-foreground text-xs'>Criada</div>
                  </div>
                </div>

                {/* Ranks Preview */}
                {modalidadeRanks.length > 0 && (
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium'>Graduações:</h4>
                    <div className='flex flex-wrap gap-1'>
                      {modalidadeRanks.slice(0, 4).map((rank) => (
                        <Badge
                          key={rank.id}
                          variant='outline'
                          className={`text-xs ${getBeltColor(rank.description)}`}
                        >
                          {rank.name}
                        </Badge>
                      ))}
                      {modalidadeRanks.length > 4 && (
                        <Badge variant='outline' className='text-xs'>
                          +{modalidadeRanks.length - 4} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  variant='outline'
                  className='w-full hover:bg-blue-50'
                  onClick={() => setSelectedModalidade(modalidade)}
                >
                  <Eye className='mr-2 h-4 w-4' />
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialogs */}
      {selectedModalidade && (
        <ModalidadeDetailDialog
          modalidade={selectedModalidade}
          ranks={ranks.filter(
            (rank) => rank.idDiscipline === selectedModalidade.id
          )}
          instructors={instructorDisciplines.filter(
            (inst) => inst.idDiscipline === selectedModalidade.id
          )}
          open={!!selectedModalidade}
          onOpenChange={() => setSelectedModalidade(null)}
        />
      )}

      <CreateModalidadeDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {editingModalidade && (
        <EditModalidadeDialog
          modalidade={editingModalidade}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={(updatedModalidade) => {
            // Here you would update the modalidade in your state/API
            console.log('Updating modalidade:', updatedModalidade);
            setShowEditDialog(false);
            setEditingModalidade(null);
          }}
        />
      )}
    </div>
  );
}
