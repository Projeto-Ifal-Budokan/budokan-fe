import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function InstructorsSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Skeleton */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-12 w-12 rounded-xl' />
              <div className='space-y-2'>
                <Skeleton className='h-10 w-80' />
                <Skeleton className='h-5 w-60' />
              </div>
            </div>
          </div>
          <Skeleton className='h-10 w-40' />
        </div>

        {/* Stats Cards Skeleton */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-4' />
              </CardHeader>
              <CardContent>
                <Skeleton className='mb-2 h-8 w-16' />
                <Skeleton className='h-3 w-20' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center'>
            <Skeleton className='h-10 w-80' />
            <Skeleton className='h-10 w-40' />
            <Skeleton className='h-10 w-40' />
          </div>
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='space-y-2'>
                <Skeleton className='h-6 w-48' />
                <Skeleton className='h-4 w-64' />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-3 w-48' />
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-6 w-20' />
                    <Skeleton className='h-8 w-8' />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
