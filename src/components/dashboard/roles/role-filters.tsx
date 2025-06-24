import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface RoleFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function RoleFilters({ searchTerm, setSearchTerm }: RoleFiltersProps) {
  return (
    <div className='flex items-center gap-4'>
      <div className='relative max-w-sm flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='Pesquisar papéis...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>
    </div>
  );
}
