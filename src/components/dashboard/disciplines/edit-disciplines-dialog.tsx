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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Modalidade {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface EditModalidadeDialogProps {
  modalidade: Modalidade;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (modalidade: Modalidade) => void;
}

export function EditModalidadeDialog({
  modalidade,
  open,
  onOpenChange,
  onSave,
}: EditModalidadeDialogProps) {
  //   const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: modalidade.name,
    description: modalidade.description,
    status: modalidade.status,
  });

  const [ranks, setRanks] = useState([
    { id: 1, name: '7º Kyu', description: 'Faixa Branca', isEditing: false },
    { id: 2, name: '6º Kyu', description: 'Faixa Amarela', isEditing: false },
    { id: 3, name: '5º Kyu', description: 'Faixa Laranja', isEditing: false },
    { id: 4, name: '4º Kyu', description: 'Faixa Verde', isEditing: false },
    { id: 5, name: '3º Kyu', description: 'Faixa Roxa', isEditing: false },
    { id: 6, name: '2º Kyu', description: 'Faixa Marrom', isEditing: false },
    { id: 7, name: '1º Kyu', description: 'Faixa Marrom', isEditing: false },
    { id: 8, name: '1º Dan', description: 'Faixa Preta', isEditing: false },
  ]);

  const [instructors] = useState([
    { id: 1, name: 'Sensei Yamamoto', rank: '3º Dan', status: 'active' },
    { id: 2, name: 'Sensei Tanaka', rank: '2º Dan', status: 'active' },
  ]);

  const [newRank, setNewRank] = useState({ name: '', description: '' });
  const [showAddRank, setShowAddRank] = useState(false);

  useEffect(() => {
    setFormData({
      name: modalidade.name,
      description: modalidade.description,
      status: modalidade.status,
    });
  }, [modalidade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedModalidade: Modalidade = {
      ...modalidade,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedModalidade);

    toast.success('Modalidade atualizada');
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

  const handleEditRank = (rankId: number) => {
    setRanks(
      ranks.map((rank) =>
        rank.id === rankId ? { ...rank, isEditing: !rank.isEditing } : rank
      )
    );
  };

  const handleSaveRank = (
    rankId: number,
    updatedRank: { name: string; description: string }
  ) => {
    setRanks(
      ranks.map((rank) =>
        rank.id === rankId
          ? { ...rank, ...updatedRank, isEditing: false }
          : rank
      )
    );

    toast.success('Graduação atualizada');
  };

  const handleDeleteRank = (rankId: number) => {
    setRanks(ranks.filter((rank) => rank.id !== rankId));

    toast.success('Graduação removida com sucesso');
  };

  const handleAddRank = () => {
    if (newRank.name && newRank.description) {
      const newId = Math.max(...ranks.map((r) => r.id)) + 1;
      setRanks([
        ...ranks,
        {
          id: newId,
          name: newRank.name,
          description: newRank.description,
          isEditing: false,
        },
      ]);
      setNewRank({ name: '', description: '' });
      setShowAddRank(false);

      toast.info('Graduação adicionada');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='text-2xl text-blue-700'>
                Editar Modalidade
              </DialogTitle>
              <p className='text-muted-foreground mt-1'>
                Gerencie informações, graduações e instrutores
              </p>
            </div>
            <Badge
              variant={formData.status === 'active' ? 'default' : 'secondary'}
              className={
                formData.status === 'active'
                  ? 'border-green-300 bg-green-100 text-green-800'
                  : ''
              }
            >
              {formData.status === 'active' ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='general'>Informações Gerais</TabsTrigger>
            <TabsTrigger value='ranks'>Graduações</TabsTrigger>
            <TabsTrigger value='instructors'>Instrutores</TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='space-y-4'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-blue-700'>
                    Dados da Modalidade
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Nome da Modalidade</Label>
                      <Input
                        id='name'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder='Ex: Karate-Do, Kendo, Arqueria...'
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='status'>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            status: value as 'active' | 'inactive',
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='active'>Ativa</SelectItem>
                          <SelectItem value='inactive'>Inativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='description'>Descrição</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder='Descreva a modalidade...'
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <div className='flex justify-end space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' className='bg-blue-600 hover:bg-blue-700'>
                  <Save className='mr-2 h-4 w-4' />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value='ranks' className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-blue-700'>
                Gerenciar Graduações
              </h3>
              <Button
                size='sm'
                className='bg-blue-600 hover:bg-blue-700'
                onClick={() => setShowAddRank(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Nova Graduação
              </Button>
            </div>

            {showAddRank && (
              <Card className='border-blue-200'>
                <CardHeader>
                  <CardTitle className='text-base text-blue-700'>
                    Adicionar Nova Graduação
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label>Nome da Graduação</Label>
                      <Input
                        value={newRank.name}
                        onChange={(e) =>
                          setNewRank({ ...newRank, name: e.target.value })
                        }
                        placeholder='Ex: 1º Kyu, 1º Dan...'
                      />
                    </div>
                    <div>
                      <Label>Descrição/Cor da Faixa</Label>
                      <Select
                        value={newRank.description}
                        onValueChange={(value) =>
                          setNewRank({ ...newRank, description: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione a cor da faixa' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Faixa Branca'>
                            Faixa Branca
                          </SelectItem>
                          <SelectItem value='Faixa Amarela'>
                            Faixa Amarela
                          </SelectItem>
                          <SelectItem value='Faixa Laranja'>
                            Faixa Laranja
                          </SelectItem>
                          <SelectItem value='Faixa Verde'>
                            Faixa Verde
                          </SelectItem>
                          <SelectItem value='Faixa Roxa'>Faixa Roxa</SelectItem>
                          <SelectItem value='Faixa Marrom'>
                            Faixa Marrom
                          </SelectItem>
                          <SelectItem value='Faixa Preta'>
                            Faixa Preta
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className='flex justify-end space-x-2'>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setShowAddRank(false);
                        setNewRank({ name: '', description: '' });
                      }}
                    >
                      <X className='mr-2 h-4 w-4' />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddRank}
                      className='bg-blue-600 hover:bg-blue-700'
                      disabled={!newRank.name || !newRank.description}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {ranks.map((rank) => (
                <RankEditCard
                  key={rank.id}
                  rank={rank}
                  onEdit={() => handleEditRank(rank.id)}
                  onSave={(updatedRank) => handleSaveRank(rank.id, updatedRank)}
                  onDelete={() => handleDeleteRank(rank.id)}
                  getBeltColor={getBeltColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value='instructors' className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-blue-700'>
                Instrutores Associados
              </h3>
              <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                <Plus className='mr-2 h-4 w-4' />
                Associar Instrutor
              </Button>
            </div>

            <div className='space-y-4'>
              {instructors.map((instructor) => (
                <Card key={instructor.id} className='border-blue-200'>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-1'>
                        <h4 className='font-semibold'>{instructor.name}</h4>
                        <div className='flex items-center space-x-2'>
                          <Badge
                            variant='outline'
                            className='border-gray-700 bg-gray-900 text-white'
                          >
                            {instructor.rank}
                          </Badge>
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
                      </div>
                      <div className='flex space-x-2'>
                        <Button variant='outline' size='sm'>
                          <Edit className='mr-2 h-4 w-4' />
                          Editar
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-red-600 hover:text-red-700'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Componente separado para edição de ranks
interface RankEditCardProps {
  rank: { id: number; name: string; description: string; isEditing: boolean };
  onEdit: () => void;
  onSave: (rank: { name: string; description: string }) => void;
  onDelete: () => void;
  getBeltColor: (description: string) => string;
}

function RankEditCard({
  rank,
  onEdit,
  onSave,
  onDelete,
  getBeltColor,
}: RankEditCardProps) {
  const [editData, setEditData] = useState({
    name: rank.name,
    description: rank.description,
  });

  const handleSave = () => {
    onSave(editData);
  };

  const handleCancel = () => {
    setEditData({ name: rank.name, description: rank.description });
    onEdit();
  };

  return (
    <Card className='border-blue-200 transition-shadow hover:shadow-md'>
      <CardContent className='p-4'>
        {rank.isEditing ? (
          <div className='space-y-3'>
            <div>
              <Label className='text-xs'>Nome da Graduação</Label>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className='mt-1'
              />
            </div>
            <div>
              <Label className='text-xs'>Cor da Faixa</Label>
              <Select
                value={editData.description}
                onValueChange={(value) =>
                  setEditData({ ...editData, description: value })
                }
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Faixa Branca'>Faixa Branca</SelectItem>
                  <SelectItem value='Faixa Amarela'>Faixa Amarela</SelectItem>
                  <SelectItem value='Faixa Laranja'>Faixa Laranja</SelectItem>
                  <SelectItem value='Faixa Verde'>Faixa Verde</SelectItem>
                  <SelectItem value='Faixa Roxa'>Faixa Roxa</SelectItem>
                  <SelectItem value='Faixa Marrom'>Faixa Marrom</SelectItem>
                  <SelectItem value='Faixa Preta'>Faixa Preta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex justify-end space-x-2'>
              <Button variant='outline' size='sm' onClick={handleCancel}>
                <X className='h-3 w-3' />
              </Button>
              <Button
                size='sm'
                onClick={handleSave}
                className='bg-blue-600 hover:bg-blue-700'
              >
                <Save className='h-3 w-3' />
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-3'>
            <div className='flex items-start justify-between'>
              <div>
                <h4 className='font-semibold text-blue-700'>{rank.name}</h4>
                <Badge
                  variant='outline'
                  className={`${getBeltColor(rank.description)} mt-1 text-xs`}
                >
                  {rank.description}
                </Badge>
              </div>
              <div className='flex space-x-1'>
                <Button variant='ghost' size='sm' onClick={onEdit}>
                  <Edit className='h-3 w-3' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onDelete}
                  className='text-red-600 hover:text-red-700'
                >
                  <Trash2 className='h-3 w-3' />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
