import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Discipline } from '@/types/discipline';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';

interface SessionFiltersProps {
  disciplines: Discipline[];
  selectedDiscipline: string;
  onDisciplineChange: (value: string) => void;
  onDateChange: (initialDate: string, finalDate: string) => void;
  initialDate: string;
  finalDate: string;
}

export function SessionFilters({
  disciplines,
  selectedDiscipline,
  onDisciplineChange,
  onDateChange,
  initialDate,
  finalDate,
}: SessionFiltersProps) {
  const [localInitialDate, setLocalInitialDate] = useState(initialDate);
  const [localFinalDate, setLocalFinalDate] = useState(finalDate);

  const handleApplyDateFilter = () => {
    onDateChange(localInitialDate, localFinalDate);
  };

  const handleClearDateFilter = () => {
    setLocalInitialDate('');
    setLocalFinalDate('');
    onDateChange('', '');
  };

  const hasDateFilter = initialDate || finalDate;

  return (
    <div className='bg-card rounded-lg border p-4'>
      <div className='flex flex-col space-y-4'>
        <div className='flex items-center gap-2'>
          <CalendarIcon className='h-4 w-4' />
          <h3 className='text-sm font-medium'>Filtros</h3>
        </div>

        <div className='grid gap-4 md:grid-cols-4'>
          <div className='space-y-2'>
            <Label htmlFor='discipline-filter'>Disciplina</Label>
            <Select
              value={selectedDiscipline}
              onValueChange={onDisciplineChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='Todas as disciplinas' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas as disciplinas</SelectItem>
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

          <div className='space-y-2'>
            <Label htmlFor='initial-date'>Data Inicial</Label>
            <Input
              id='initial-date'
              type='date'
              value={localInitialDate}
              onChange={(e) => setLocalInitialDate(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='final-date'>Data Final</Label>
            <Input
              id='final-date'
              type='date'
              value={localFinalDate}
              onChange={(e) => setLocalFinalDate(e.target.value)}
            />
          </div>

          <div className='flex items-end gap-2'>
            <Button
              onClick={handleApplyDateFilter}
              variant='outline'
              className='flex-1'
            >
              Aplicar
            </Button>
            {hasDateFilter && (
              <Button
                onClick={handleClearDateFilter}
                variant='outline'
                size='icon'
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
