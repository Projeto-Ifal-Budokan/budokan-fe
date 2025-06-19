'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  Award,
  Calendar,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const instrutores = [
  {
    id: 1,
    nome: 'Takeshi Yamamoto',
    email: 'takeshi@budokan.com',
    telefone: '(11) 99999-1111',
    modalidades: ['Karatê Shotokan'],
    graduacao: '8º Dan',
    experiencia: '25 anos',
    alunos: 45,
    turmas: 3,
    status: 'Ativo',
    avatar: '/placeholder.svg?height=40&width=40',
    especialidades: ['Kata', 'Kumite', 'Defesa Pessoal'],
    biografia:
      'Mestre em Karatê Shotokan com mais de 25 anos de experiência. Formado pela JKA (Japan Karate Association).',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@budokan.com',
    telefone: '(11) 99999-2222',
    modalidades: ['Kendô'],
    graduacao: '6º Dan',
    experiencia: '18 anos',
    alunos: 28,
    turmas: 2,
    status: 'Ativo',
    avatar: '/placeholder.svg?height=40&width=40',
    especialidades: ['Kendo Tradicional', 'Iaido'],
    biografia:
      'Especialista em Kendô com formação na All Japan Kendo Federation. Campeã nacional em 2015.',
  },
  {
    id: 3,
    nome: 'João Silva',
    email: 'joao@budokan.com',
    telefone: '(11) 99999-3333',
    modalidades: ['Kyudô'],
    graduacao: '5º Dan',
    experiencia: '15 anos',
    alunos: 15,
    turmas: 1,
    status: 'Ativo',
    avatar: '/placeholder.svg?height=40&width=40',
    especialidades: ['Tiro com Arco', 'Meditação'],
    biografia: 'Mestre em Kyudô com foco na filosofia zen e precisão técnica.',
  },
  {
    id: 4,
    nome: 'Ana Costa',
    email: 'ana@budokan.com',
    telefone: '(11) 99999-4444',
    modalidades: ['Aikidô'],
    graduacao: '4º Dan',
    experiencia: '12 anos',
    alunos: 32,
    turmas: 2,
    status: 'Licença',
    avatar: '/placeholder.svg?height=40&width=40',
    especialidades: ['Aikido Tradicional', 'Ki Development'],
    biografia:
      'Instrutora de Aikidô com formação no Aikikai Foundation. Especialista em técnicas de harmonização.',
  },
];

export default function InstrutoresManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [selectedInstrutor, setSelectedInstrutor] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // cards or table

  const filteredInstrutores = instrutores.filter(
    (instrutor) =>
      instrutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrutor.modalidades.some((mod) =>
        mod.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      instrutor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Instrutores</h1>
          <p className='text-muted-foreground'>
            Gerencie os instrutores e professores do Budokan
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Novo Instrutor
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Instrutor</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo instrutor
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='nome'>Nome Completo</Label>
                  <Input id='nome' placeholder='Nome do instrutor' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='email@budokan.com'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='telefone'>Telefone</Label>
                  <Input id='telefone' placeholder='(11) 99999-9999' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='graduacao'>Graduação</Label>
                  <Input id='graduacao' placeholder='Ex: 5º Dan' />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='modalidade'>Modalidade Principal</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione uma modalidade' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='karate'>Karatê Shotokan</SelectItem>
                      <SelectItem value='kendo'>Kendô</SelectItem>
                      <SelectItem value='kyudo'>Kyudô</SelectItem>
                      <SelectItem value='aikido'>Aikidô</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='experiencia'>Anos de Experiência</Label>
                  <Input id='experiencia' type='number' placeholder='15' />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='especialidades'>Especialidades</Label>
                <Input
                  id='especialidades'
                  placeholder='Ex: Kata, Kumite, Defesa Pessoal'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='biografia'>Biografia</Label>
                <Textarea
                  id='biografia'
                  placeholder='Breve biografia do instrutor...'
                />
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setIsAddModalOpen(false)}>
                Salvar Instrutor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Instrutores
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4</div>
            <p className='text-muted-foreground text-xs'>
              3 ativos, 1 em licença
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Experiência Média
            </CardTitle>
            <Award className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>17.5</div>
            <p className='text-muted-foreground text-xs'>anos de experiência</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Alunos Atendidos
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>120</div>
            <p className='text-muted-foreground text-xs'>total de alunos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Turmas Ativas</CardTitle>
            <Calendar className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>8</div>
            <p className='text-muted-foreground text-xs'>turmas em andamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Toggle */}
      <div className='flex items-center justify-between'>
        <div className='relative max-w-sm flex-1'>
          <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
          <Input
            placeholder='Buscar instrutores...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-8'
          />
        </div>
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

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredInstrutores.map((instrutor) => (
            <Card
              key={instrutor.id}
              className='transition-shadow hover:shadow-md'
            >
              <CardHeader>
                <div className='flex items-start gap-4'>
                  <Avatar className='h-12 w-12'>
                    <AvatarImage
                      src={instrutor.avatar || '/placeholder.svg'}
                      alt={instrutor.nome}
                    />
                    <AvatarFallback>
                      {instrutor.nome
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <CardTitle className='text-lg'>
                          {instrutor.nome}
                        </CardTitle>
                        <CardDescription>{instrutor.graduacao}</CardDescription>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={
                            instrutor.status === 'Ativo'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {instrutor.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>
                              <Eye className='mr-2 h-4 w-4' />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className='mr-2 h-4 w-4' />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-destructive'>
                              <Trash2 className='mr-2 h-4 w-4' />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Mail className='text-muted-foreground h-4 w-4' />
                    <span>{instrutor.email}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Phone className='text-muted-foreground h-4 w-4' />
                    <span>{instrutor.telefone}</span>
                  </div>

                  <div>
                    <p className='mb-2 text-sm font-medium'>Modalidades:</p>
                    <div className='flex flex-wrap gap-1'>
                      {instrutor.modalidades.map((modalidade, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'
                        >
                          {modalidade}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className='mb-2 text-sm font-medium'>Especialidades:</p>
                    <div className='flex flex-wrap gap-1'>
                      {instrutor.especialidades.map((esp, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {esp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-4 border-t pt-4'>
                    <div className='text-center'>
                      <div className='text-lg font-bold'>
                        {instrutor.alunos}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        Alunos
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-lg font-bold'>
                        {instrutor.turmas}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        Turmas
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-lg font-bold'>
                        {instrutor.experiencia}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        Experiência
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Instrutores</CardTitle>
            <CardDescription>
              Visualização em tabela dos instrutores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instrutor</TableHead>
                  <TableHead>Modalidades</TableHead>
                  <TableHead>Graduação</TableHead>
                  <TableHead>Experiência</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstrutores.map((instrutor) => (
                  <TableRow key={instrutor.id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={instrutor.avatar || '/placeholder.svg'}
                            alt={instrutor.nome}
                          />
                          <AvatarFallback className='text-xs'>
                            {instrutor.nome
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>{instrutor.nome}</div>
                          <div className='text-muted-foreground text-sm'>
                            {instrutor.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-1'>
                        {instrutor.modalidades.map((mod, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='text-xs'
                          >
                            {mod}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>{instrutor.graduacao}</Badge>
                    </TableCell>
                    <TableCell>{instrutor.experiencia}</TableCell>
                    <TableCell>{instrutor.alunos}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          instrutor.status === 'Ativo' ? 'default' : 'secondary'
                        }
                      >
                        {instrutor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>
                            <Eye className='mr-2 h-4 w-4' />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className='mr-2 h-4 w-4' />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className='text-destructive'>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
