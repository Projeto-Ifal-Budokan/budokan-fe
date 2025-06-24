import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RolesSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <Skeleton className='h-8 w-32' />
          <Skeleton className='mt-2 h-4 w-48' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>

      {/* Stats Cards Skeleton */}
      <div className='grid gap-4 md:grid-cols-3'>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16' />
              <Skeleton className='mt-2 h-3 w-20' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className='flex items-center gap-4'>
        <Skeleton className='h-10 w-full max-w-sm' />
        <Skeleton className='h-10 w-40' />
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='mt-2 h-4 w-48' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-24' />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center justify-between'>
                <Skeleton className='h-12 w-48' />
                <Skeleton className='h-12 w-48' />
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-8 w-8' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
