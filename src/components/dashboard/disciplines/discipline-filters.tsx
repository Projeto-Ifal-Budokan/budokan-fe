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

interface DisciplineFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

export function DisciplineFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}: DisciplineFiltersProps) {
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
              placeholder='Buscar por nome ou descrição...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-11 border-gray-200 bg-white pl-10 shadow-sm focus:border-emerald-500 focus:ring-emerald-500'
            />
          </div>

          <div className='flex gap-3'>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className='h-11 w-40 border-gray-200 bg-white shadow-sm'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='todos'>Todos</SelectItem>
                <SelectItem value='active'>Ativo</SelectItem>
                <SelectItem value='inactive'>Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
