import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DisciplinesSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Skeleton */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-12 w-12 rounded-xl' />
              <div>
                <Skeleton className='h-8 w-80' />
                <Skeleton className='mt-2 h-5 w-60' />
              </div>
            </div>
          </div>
          <Skeleton className='h-10 w-40' />
        </div>

        {/* Stats Cards Skeleton */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='relative overflow-hidden'>
              <CardHeader className='pb-2'>
                <Skeleton className='h-4 w-24' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-16' />
                <Skeleton className='mt-2 h-3 w-20' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent>
            <div className='flex gap-4'>
              <Skeleton className='h-11 max-w-md flex-1' />
              <Skeleton className='h-11 w-40' />
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48' />
          </CardHeader>
          <CardContent className='p-1'>
            <div className='space-y-2 p-6'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex items-center gap-4'>
                  <Skeleton className='h-10 w-10 rounded-lg' />
                  <Skeleton className='h-4 flex-1' />
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-4 w-12' />
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-8 w-8' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
