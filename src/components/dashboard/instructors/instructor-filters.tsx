import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

interface InstructorFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterDiscipline: string;
  setFilterDiscipline: (discipline: string) => void;
}

export function InstructorFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterDiscipline,
  setFilterDiscipline,
}: InstructorFiltersProps) {
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('todos');
    setFilterDiscipline('todos');
  };

  const hasActiveFilters =
    searchTerm || filterStatus !== 'todos' || filterDiscipline !== 'todos';

  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center'>
        {/* Search */}
        <div className='relative min-w-80'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <Input
            placeholder='Buscar por nome, email ou disciplina...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Status Filter */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='todos'>Todos Status</SelectItem>
            <SelectItem value='active'>Ativo</SelectItem>
            <SelectItem value='inactive'>Inativo</SelectItem>
            <SelectItem value='on_leave'>Em Licença</SelectItem>
          </SelectContent>
        </Select>

        {/* Discipline Filter */}
        <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Disciplina' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='todos'>Todas Disciplinas</SelectItem>
            <SelectItem value='1'>Karatê</SelectItem>
            <SelectItem value='2'>Kendô</SelectItem>
            <SelectItem value='3'>Kyudô</SelectItem>
            <SelectItem value='4'>Aikidô</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant='outline' onClick={clearFilters} className='gap-2'>
            <Filter className='h-4 w-4' />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
