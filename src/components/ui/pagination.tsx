'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {/* Page info and page size selector */}
      <div className='flex items-center gap-4'>
        <div className='text-sm text-gray-600'>
          Mostrando {startItem} a {endItem} de {totalItems} registros
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Itens por página:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='25'>25</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination controls */}
      <div className='flex items-center gap-1'>
        {/* First page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className='h-9 w-9 p-0'
        >
          <ChevronsLeft className='h-4 w-4' />
          <span className='sr-only'>Primeira página</span>
        </Button>

        {/* Previous page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='h-9 w-9 p-0'
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Página anterior</span>
        </Button>

        {/* Show dots if there are pages before visible range */}
        {visiblePages[0] > 1 && (
          <>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(1)}
              className='h-9 w-9 p-0'
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <div className='flex h-9 w-9 items-center justify-center'>
                <MoreHorizontal className='h-4 w-4' />
              </div>
            )}
          </>
        )}

        {/* Page numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size='sm'
            onClick={() => onPageChange(page)}
            className='h-9 w-9 p-0'
          >
            {page}
          </Button>
        ))}

        {/* Show dots if there are pages after visible range */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <div className='flex h-9 w-9 items-center justify-center'>
                <MoreHorizontal className='h-4 w-4' />
              </div>
            )}
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(totalPages)}
              className='h-9 w-9 p-0'
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='h-9 w-9 p-0'
        >
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>Próxima página</span>
        </Button>

        {/* Last page */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className='h-9 w-9 p-0'
        >
          <ChevronsRight className='h-4 w-4' />
          <span className='sr-only'>Última página</span>
        </Button>
      </div>
    </div>
  );
}
