import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RankingsSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-12 w-12 rounded-xl' />
          <div>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='mt-2 h-4 w-80' />
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className='grid gap-4 md:grid-cols-3'>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16' />
              <Skeleton className='mt-2 h-3 w-40' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-5' />
              <Skeleton className='h-6 w-32' />
            </div>
            <Skeleton className='h-10 w-32' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 md:flex-row md:items-center'>
            <Skeleton className='h-11 w-full max-w-md' />
            <div className='flex gap-3'>
              <Skeleton className='h-11 w-48' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent className='p-1'>
          <div className='space-y-4'>
            {/* Table Header */}
            <div className='flex items-center justify-between bg-gray-50/50 px-6 py-3'>
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className='h-4 w-20' />
              ))}
            </div>

            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='flex items-center justify-between px-6 py-4'
              >
                {[...Array(7)].map((_, j) => (
                  <Skeleton key={j} className='h-4 w-20' />
                ))}
              </div>
            ))}

            {/* Pagination */}
            <div className='flex items-center justify-between border-t bg-gray-50/50 px-6 py-4'>
              <Skeleton className='h-4 w-48' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-20' />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
