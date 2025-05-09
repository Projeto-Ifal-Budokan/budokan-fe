'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { FiltersCard, FilterState } from './filters-card';

export function AttendanceManagement() {
  // State for dialogs
  const [isNewClassDialogOpen, setIsNewClassDialogOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    discipline: 'all',
    dateRange: { from: undefined, to: undefined },
  });

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      discipline: 'all',
      dateRange: { from: undefined, to: undefined },
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Aulas e Frequência</h2>
        <Button
          onClick={() => setIsNewClassDialogOpen(true)}
          className='bg-primary hover:bg-primary/90'
        >
          <PlusCircle className='mr-2 h-4 w-4' />
          Nova Aula
        </Button>
      </div>

      {/* Filters */}
      <FiltersCard filters={filters} setFilters={setFilters}>
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
      </FiltersCard>

      {/* New Class Dialog */}

      {/* Attendance Management Dialog */}
    </div>
  );
}

export default AttendanceManagement;
