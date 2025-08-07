import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useManageDisciplines } from '@/lib/api/queries/use-manage-disciplines';
import { Filter, Search } from 'lucide-react';

interface MatriculationFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterDiscipline: string;
  setFilterDiscipline: (value: string) => void;
}

export function MatriculationFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterDiscipline,
  setFilterDiscipline,
}: MatriculationFiltersProps) {
  const { useDisciplines } = useManageDisciplines();
  const { data: disciplinesResponse } = useDisciplines();
  const disciplines = disciplinesResponse?.data?.items || [];

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
              placeholder='Buscar por nome do usuário...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-11 border-gray-200 bg-white pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div className='flex gap-3'>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className='h-11 w-40 border-gray-200 bg-white shadow-sm'>
                <SelectValue placeholder='Tipo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos</SelectItem>
                <SelectItem value='student'>Aluno</SelectItem>
                <SelectItem value='instructor'>Instrutor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className='h-11 w-40 border-gray-200 bg-white shadow-sm'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos</SelectItem>
                <SelectItem value='active'>Ativo</SelectItem>
                <SelectItem value='inactive'>Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterDiscipline}
              onValueChange={setFilterDiscipline}
            >
              <SelectTrigger className='h-11 w-48 border-gray-200 bg-white shadow-sm'>
                <SelectValue placeholder='Disciplina' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas</SelectItem>
                {disciplines.map((discipline) => (
                  <SelectItem
                    key={discipline.id}
                    value={discipline.id.toString()}
                  >
                    {discipline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
