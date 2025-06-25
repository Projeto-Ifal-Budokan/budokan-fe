import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterTipo: string;
  setFilterTipo: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

export function UserFilters({
  searchTerm,
  setSearchTerm,
  filterTipo,
  setFilterTipo,
  filterStatus,
  setFilterStatus,
}: UserFiltersProps) {
  return (
    <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2'>
          <Filter className='h-5 w-5 text-gray-600' />
          <CardTitle className='text-lg'>Filtros e Busca</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='relative max-w-md flex-1'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='Buscar por nome ou email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-11 border-gray-200 bg-white pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div className='flex gap-3'>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className='h-11 w-48 border-gray-200 bg-white shadow-sm'>
                <SelectValue placeholder='Filtrar por tipo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='todos'>Todos os tipos</SelectItem>
                <SelectItem value='administrador'>Administrador</SelectItem>
                <SelectItem value='instrutor'>Instrutor</SelectItem>
                <SelectItem value='funcionario'>Funcionário</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className='h-11 w-40 border-gray-200 bg-white shadow-sm'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='todos'>Todos</SelectItem>
                <SelectItem value='active'>Ativo</SelectItem>
                <SelectItem value='inactive'>Inativo</SelectItem>
                <SelectItem value='suspended'>Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
