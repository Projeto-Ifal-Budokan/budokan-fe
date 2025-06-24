import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DisciplineDetailSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Skeleton */}
        <div className='space-y-6'>
          <Skeleton className='h-4 w-48' />
          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-16 w-16 rounded-2xl' />
                <div>
                  <div className='mb-2 flex items-center gap-3'>
                    <Skeleton className='h-8 w-60' />
                    <Skeleton className='h-6 w-16' />
                  </div>
                  <Skeleton className='h-5 w-80' />
                </div>
              </div>
            </div>
            <Skeleton className='h-10 w-24' />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className='pb-3'>
                <Skeleton className='h-4 w-32' />
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-5 w-5' />
                  <Skeleton className='h-8 w-12' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <Card>
          <CardContent className='p-0'>
            <div className='border-b'>
              <div className='grid grid-cols-3 gap-0'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className='border-r p-4 last:border-r-0'>
                    <Skeleton className='mx-auto h-6 w-24' />
                  </div>
                ))}
              </div>
            </div>
            <div className='space-y-6 p-6'>
              <div className='flex justify-between'>
                <div>
                  <Skeleton className='mb-2 h-6 w-48' />
                  <Skeleton className='h-4 w-64' />
                </div>
                <Skeleton className='h-10 w-32' />
              </div>
              <div className='space-y-4'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
