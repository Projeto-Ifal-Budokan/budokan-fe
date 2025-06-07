'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Award, Calendar, Edit, Plus, Users } from 'lucide-react';
import { useState } from 'react';

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

interface ModalidadeDetailDialogProps {
  modalidade: Modalidade;
  ranks: Rank[];
  instructors: InstructorDiscipline[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalidadeDetailDialog({
  modalidade,
  ranks,
  instructors,
  open,
  onOpenChange,
}: ModalidadeDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: modalidade.name,
    description: modalidade.description,
    status: modalidade.status,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w- max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='text-2xl text-blue-900'>
                {modalidade.name}
              </DialogTitle>
              <p className='text-muted-foreground mt-1'>
                {modalidade.description}
              </p>
            </div>
            <Badge
              variant={modalidade.status === 'active' ? 'default' : 'secondary'}
              className={
                modalidade.status === 'active'
                  ? 'border-green-300 bg-green-100 text-green-800'
                  : ''
              }
            >
              {modalidade.status === 'active' ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
            <TabsTrigger value='ranks'>Graduações</TabsTrigger>
            <TabsTrigger value='instructors'>Instrutores</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de Graduações
                  </CardTitle>
                  <Award className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{ranks.length}</div>
                  <p className='text-muted-foreground text-xs'>
                    Ranks cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Instrutores Ativos
                  </CardTitle>
                  <Users className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {
                      instructors.filter((inst) => inst.status === 'active')
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
                  <CardTitle className='text-sm font-medium'>
                    Criada em
                  </CardTitle>
                  <Calendar className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {formatDate(modalidade.createdAt)}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Atualizada em {formatDate(modalidade.updatedAt)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informações da Modalidade</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-muted-foreground text-sm font-medium'>
                      Nome
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className='mt-1'
                      />
                    ) : (
                      <p className='text-sm'>{modalidade.name}</p>
                    )}
                  </div>
                  <div>
                    <label className='text-muted-foreground text-sm font-medium'>
                      Status
                    </label>
                    {isEditing ? (
                      <Select
                        value={editData.status}
                        onValueChange={(value) =>
                          setEditData({
                            ...editData,
                            status: value as 'active' | 'inactive',
                          })
                        }
                      >
                        <SelectTrigger className='mt-1'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='active'>Ativa</SelectItem>
                          <SelectItem value='inactive'>Inativa</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className='text-sm'>
                        {modalidade.status === 'active' ? 'Ativa' : 'Inativa'}
                      </p>
                    )}
                  </div>
                  <div className='col-span-2'>
                    <label className='text-muted-foreground text-sm font-medium'>
                      Descrição
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className='mt-1'
                        rows={3}
                      />
                    ) : (
                      <p className='text-sm'>{modalidade.description}</p>
                    )}
                  </div>
                </div>
                <div className='flex space-x-2'>
                  {!isEditing ? (
                    <Button
                      className='bg-primary hover:bg-primary/90'
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      Editar Modalidade
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant='outline'
                        onClick={() => {
                          setIsEditing(false);
                          setEditData({
                            name: modalidade.name,
                            description: modalidade.description,
                            status: modalidade.status,
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          // Save logic here
                          console.log('Saving:', editData);
                          setIsEditing(false);
                        }}
                      >
                        Salvar
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='ranks' className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>
                Graduações da Modalidade
              </h3>
              <Button size='sm'>
                <Plus className='mr-2 h-4 w-4' />
                Nova Graduação
              </Button>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {ranks.map((rank) => (
                <Card
                  key={rank.id}
                  className='transition-shadow hover:shadow-md'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <CardTitle className='text-base'>{rank.name}</CardTitle>
                      <Badge
                        variant='outline'
                        className={`${getBeltColor(rank.description)} text-xs`}
                      >
                        {rank.description}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <div className='text-muted-foreground space-y-2 text-sm'>
                      <div>
                        <span className='font-medium'>Criada:</span>{' '}
                        {formatDate(rank.createdAt)}
                      </div>
                      <div>
                        <span className='font-medium'>Atualizada:</span>{' '}
                        {formatDate(rank.updatedAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {ranks.length === 0 && (
              <Card>
                <CardContent className='py-8 text-center'>
                  <Award className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <h3 className='mb-2 text-lg font-semibold'>
                    Nenhuma graduação cadastrada
                  </h3>
                  <p className='text-muted-foreground mb-4'>
                    Adicione graduações para esta modalidade para começar a
                    organizar os níveis dos alunos.
                  </p>
                  <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Adicionar Primeira Graduação
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='instructors' className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>
                Instrutores da Modalidade
              </h3>
              <Button size='sm'>
                <Plus className='mr-2 h-4 w-4' />
                Associar Instrutor
              </Button>
            </div>

            <div className='space-y-4'>
              {instructors.map((instructor) => {
                const instructorRank = ranks.find(
                  (rank) => rank.id === instructor.idRank
                );

                return (
                  <Card key={instructor.id}>
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <div className='flex items-center space-x-2'>
                            <h4 className='font-semibold'>
                              Instrutor ID: {instructor.idInstructor}
                            </h4>
                            <Badge
                              variant={
                                instructor.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className={
                                instructor.status === 'active'
                                  ? 'border-green-300 bg-green-100 text-green-800'
                                  : ''
                              }
                            >
                              {instructor.status === 'active'
                                ? 'Ativo'
                                : 'Inativo'}
                            </Badge>
                          </div>

                          {instructorRank && (
                            <div className='flex items-center space-x-2'>
                              <span className='text-muted-foreground text-sm'>
                                Graduação:
                              </span>
                              <Badge
                                variant='outline'
                                className={`${getBeltColor(instructorRank.description)} text-xs`}
                              >
                                {instructorRank.name} -{' '}
                                {instructorRank.description}
                              </Badge>
                            </div>
                          )}

                          <div className='text-muted-foreground text-sm'>
                            <div>
                              Associado em: {formatDate(instructor.createdAt)}
                            </div>
                            <div>
                              Atualizado em: {formatDate(instructor.updatedAt)}
                            </div>
                          </div>
                        </div>

                        <Button variant='outline' size='sm'>
                          <Edit className='mr-2 h-4 w-4' />
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {instructors.length === 0 && (
              <Card>
                <CardContent className='py-8 text-center'>
                  <Users className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <h3 className='mb-2 text-lg font-semibold'>
                    Nenhum instrutor associado
                  </h3>
                  <p className='text-muted-foreground mb-4'>
                    Associe instrutores a esta modalidade para que possam
                    lecionar as aulas.
                  </p>
                  <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Associar Primeiro Instrutor
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
