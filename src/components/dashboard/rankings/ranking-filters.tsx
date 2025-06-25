import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Plus, Search } from 'lucide-react';

interface Discipline {
  id: number;
  name: string;
  status: string;
}

interface RankingFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterDiscipline: string;
  setFilterDiscipline: (value: string) => void;
  disciplines: Discipline[];
  isAdmin: boolean;
  onAddClick: () => void;
}

export function RankingFilters({
  searchTerm,
  setSearchTerm,
  filterDiscipline,
  setFilterDiscipline,
  disciplines,
  isAdmin,
  onAddClick,
}: RankingFiltersProps) {
  return (
    <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Filter className='h-5 w-5 text-gray-600' />
            <CardTitle className='text-lg'>Filtros e Busca</CardTitle>
          </div>
          {isAdmin && (
            <Button
              onClick={onAddClick}
              className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            >
              <Plus className='mr-2 h-4 w-4' />
              Novo Ranking
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='relative max-w-md flex-1'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='Buscar por nome, descrição ou modalidade...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-11 border-gray-200 bg-white pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div className='flex gap-3'>
            <Select
              value={filterDiscipline}
              onValueChange={setFilterDiscipline}
            >
              <SelectTrigger className='h-11 w-48 border-gray-200 bg-white shadow-sm'>
                <SelectValue placeholder='Filtrar por modalidade' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas as modalidades</SelectItem>
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
