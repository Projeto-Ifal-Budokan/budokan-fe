import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Discipline, mockDisciplines } from '@/data/mocks/disciplines-mocks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';

export type FilterState = {
  discipline: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
};

export const FiltersCard = () => {
  const [disciplines] = useState<Discipline[]>(mockDisciplines);

  // State for filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    discipline: '',
    dateRange: { from: undefined, to: undefined },
  });

  // Check if any filters are active
  const hasActiveFilters =
    filters.discipline !== '' || filters.dateRange.from !== undefined;

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      discipline: '',
      dateRange: { from: undefined, to: undefined },
    });
  };

  return (
    <Card className='border-border/40 border shadow-sm'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center text-lg font-medium'>
            <Filter className='mr-2 h-4 w-4' />
            Filtros
            {hasActiveFilters && (
              <Badge
                variant='secondary'
                className='bg-primary/10 text-primary ml-2'
              >
                Ativos
              </Badge>
            )}
          </CardTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowFilters(!showFilters)}
            className='text-muted-foreground h-8'
          >
            {showFilters ? 'Ocultar' : 'Mostrar'}{' '}
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>
      {showFilters && (
        <CardContent>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label
                htmlFor='discipline-filter'
                className='text-sm font-medium'
              >
                Modalidade
              </Label>
              <Select
                value={filters.discipline}
                onValueChange={(value) =>
                  setFilters({ ...filters, discipline: value })
                }
              >
                <SelectTrigger id='discipline-filter' className='h-9'>
                  <SelectValue placeholder='Todas as modalidades' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas as modalidades</SelectItem>
                  {disciplines.map((discipline) => (
                    <SelectItem key={discipline.id} value={discipline.id}>
                      {discipline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Período</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='border-input h-9 w-full justify-start text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />
                    {filters.dateRange.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}{' '}
                          -{' '}
                          {format(filters.dateRange.to, 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </>
                      ) : (
                        format(filters.dateRange.from, 'dd/MM/yyyy', {
                          locale: ptBR,
                        })
                      )
                    ) : (
                      <span className='text-muted-foreground'>
                        Selecione um período
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='range'
                    selected={{
                      from: filters.dateRange.from,
                      to: filters.dateRange.to,
                    }}
                    onSelect={(range) =>
                      setFilters({
                        ...filters,
                        dateRange: {
                          from: range?.from,
                          to: range?.to,
                        },
                      })
                    }
                    locale={ptBR}
                    initialFocus
                    className='rounded-md border'
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className='mt-4 flex justify-end space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={resetFilters}
              className='h-8'
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
