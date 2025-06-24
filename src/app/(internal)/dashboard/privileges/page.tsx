'use client';

import { PrivilegesTable } from '@/components/dashboard/privileges/privileges-table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/api/queries/use-auth';
import {
  usePrivileges,
  usePrivilegesByUser,
} from '@/lib/api/queries/use-privileges';
import { Privilege } from '@/types/user';
import { hasAccess } from '@/utils/access-control';
import { Key, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PrivilegesSkeleton } from './privileges-skeleton';

export default function PrivilegesManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hooks
  const router = useRouter();
  const { data: currentUser } = useAuth().me;
  const { data: currentUserPrivileges } = usePrivilegesByUser(
    currentUser?.id.toString() || ''
  );

  // Use the privileges query
  const { privileges } = usePrivileges();
  const { data: privilegesData, isLoading } = privileges;

  // Access control
  const isAdmin = currentUserPrivileges
    ? hasAccess('admin', currentUserPrivileges)
    : false;

  // Redirect if not admin
  useMemo(() => {
    if (!isLoading && !isAdmin && currentUser) {
      router.push('/dashboard/acesso-negado');
      return;
    }
  }, [isAdmin, isLoading, currentUser, router]);

  // Filter privileges based on search term
  const filteredPrivileges = useMemo(() => {
    if (!privilegesData) return [];

    return privilegesData.filter(
      (privilege) =>
        privilege.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        privilege.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [privilegesData, searchTerm]);

  // Paginate filtered privileges
  const paginatedPrivileges = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPrivileges.slice(startIndex, endIndex);
  }, [filteredPrivileges, currentPage, pageSize]);

  // Calculate stats
  const privilegeStats = useMemo(() => {
    if (!privilegesData) return { total: 0, categories: 0 };

    const categories = new Set(privilegesData.map((p) => p.name.split('_')[0]));

    return {
      total: privilegesData.length,
      categories: categories.size,
    };
  }, [privilegesData]);

  // Group privileges by category for better organization
  const privilegesByCategory = useMemo(() => {
    const categories: Record<string, Privilege[]> = {};

    paginatedPrivileges.forEach((privilege) => {
      const category = privilege.name.split('_')[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(privilege);
    });

    return categories;
  }, [paginatedPrivileges]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPrivileges.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <PrivilegesSkeleton />;
  }

  if (!isAdmin) {
    return null; // Will be redirected
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'>
                <Key className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                  Privilégios do Sistema
                </h1>
                <p className='text-lg text-gray-600'>
                  Visualize todos os privilégios disponíveis no sistema
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total de Privilégios
              </CardTitle>
              <Key className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{privilegeStats.total}</div>
              <p className='text-muted-foreground text-xs'>
                Privilégios definidos pelo sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Categorias</CardTitle>
              <Badge variant='secondary' className='h-4 w-4 rounded-full p-0' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {privilegeStats.categories}
              </div>
              <p className='text-muted-foreground text-xs'>
                Diferentes áreas do sistema
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtre os privilégios por nome ou descrição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-2'>
              <Search className='text-muted-foreground h-4 w-4' />
              <Input
                placeholder='Buscar privilégio...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='max-w-sm'
              />
            </div>
          </CardContent>
        </Card>

        {/* Privileges Table */}
        <PrivilegesTable
          privileges={paginatedPrivileges}
          privilegesByCategory={privilegesByCategory}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPrivileges.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
