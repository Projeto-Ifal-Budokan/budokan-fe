'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  isLoading?: boolean;
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  isLoading = false,
}: SearchFiltersProps) => {
  return (
    <div className='mb-8'>
      <div className='relative mx-auto max-w-md'>
        <div className='relative'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
          <Input
            type='text'
            placeholder='Buscar posts por título ou conteúdo...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pr-10 pl-10'
            disabled={isLoading}
          />
          {searchTerm && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onClearSearch}
              className='absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-gray-100'
              disabled={isLoading}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
        {searchTerm && (
          <p className='mt-2 text-center text-sm text-gray-600'>
            Buscando por:{' '}
            <span className='font-medium text-blue-600'>
              &quot;{searchTerm}&quot;
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
