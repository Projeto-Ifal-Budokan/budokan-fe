import { Badge } from '@/components/ui/badge';
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
import { Discipline } from '@/types/discipline';
import { Filter, Search, X } from 'lucide-react';
import { useMemo } from 'react';

interface TrainingScheduleFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterDiscipline: string;
  setFilterDiscipline: (value: string) => void;
  filterWeekday: string;
  setFilterWeekday: (value: string) => void;
  availableDisciplines: Discipline[];
}

export function TrainingScheduleFilters({
  searchTerm,
  setSearchTerm,
  filterDiscipline,
  setFilterDiscipline,
  filterWeekday,
  setFilterWeekday,
  availableDisciplines,
}: TrainingScheduleFiltersProps) {
  // Utility function
  const getWeekdayText = (weekday: string) => {
    const weekdays = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    return weekdays[weekday as keyof typeof weekdays] || weekday;
  };

  // Get selected discipline name for badge
  const selectedDisciplineName = useMemo(() => {
    if (filterDiscipline === 'all') return null;
    const discipline = availableDisciplines.find(
      (d) => d.id.toString() === filterDiscipline
    );
    return discipline?.name;
  }, [filterDiscipline, availableDisciplines]);

  // Get selected weekday name for badge
  const selectedWeekdayName = useMemo(() => {
    if (filterWeekday === 'all') return null;
    return getWeekdayText(filterWeekday);
  }, [filterWeekday]);

  // Active filters count (use trimmed search term for counting)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (filterDiscipline !== 'all') count++;
    if (filterWeekday !== 'all') count++;
    return count;
  }, [searchTerm, filterDiscipline, filterWeekday]);

  // Event handlers
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterDiscipline('all');
    setFilterWeekday('all');
  };

  const clearSearchFilter = () => {
    setSearchTerm('');
  };

  const clearDisciplineFilter = () => {
    setFilterDiscipline('all');
  };

  const clearWeekdayFilter = () => {
    setFilterWeekday('all');
  };

  return (
    <div className='space-y-4'>
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
                placeholder='Buscar por disciplina...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='h-11 border-gray-200 bg-white pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
            </div>

            <div className='flex gap-3'>
              <Select value={filterWeekday} onValueChange={setFilterWeekday}>
                <SelectTrigger className='h-11 w-48 border-gray-200 bg-white shadow-sm'>
                  <SelectValue placeholder='Dia da Semana' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos os dias</SelectItem>
                  <SelectItem value='monday'>Segunda-feira</SelectItem>
                  <SelectItem value='tuesday'>Terça-feira</SelectItem>
                  <SelectItem value='wednesday'>Quarta-feira</SelectItem>
                  <SelectItem value='thursday'>Quinta-feira</SelectItem>
                  <SelectItem value='friday'>Sexta-feira</SelectItem>
                  <SelectItem value='saturday'>Sábado</SelectItem>
                  <SelectItem value='sunday'>Domingo</SelectItem>
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
                  <SelectItem value='all'>Todas as disciplinas</SelectItem>
                  {availableDisciplines.map((discipline) => (
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

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm text-gray-600'>Filtros ativos:</span>

          {searchTerm.trim() && (
            <Badge variant='secondary' className='gap-1'>
              Busca: &quot;{searchTerm.trim()}&quot;
              <Button
                variant='ghost'
                size='sm'
                className='h-auto p-0 text-gray-500 hover:text-gray-700'
                onClick={clearSearchFilter}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          )}

          {selectedDisciplineName && (
            <Badge variant='secondary' className='gap-1'>
              {selectedDisciplineName}
              <Button
                variant='ghost'
                size='sm'
                className='h-auto p-0 text-gray-500 hover:text-gray-700'
                onClick={clearDisciplineFilter}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          )}

          {selectedWeekdayName && (
            <Badge variant='secondary' className='gap-1'>
              {selectedWeekdayName}
              <Button
                variant='ghost'
                size='sm'
                className='h-auto p-0 text-gray-500 hover:text-gray-700'
                onClick={clearWeekdayFilter}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          )}

          <Button
            variant='outline'
            size='sm'
            onClick={clearAllFilters}
            className='ml-2'
          >
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
}
