import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TrainingSchedulesSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header Skeleton */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-12 w-12 rounded-xl' />
          <div>
            <Skeleton className='h-10 w-64' />
            <Skeleton className='mt-2 h-5 w-80' />
          </div>
        </div>
        <Skeleton className='h-10 w-40' />
      </div>

      {/* Filters Skeleton */}
      <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5' />
            <Skeleton className='h-6 w-32' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 md:flex-row md:items-center'>
            <div className='relative max-w-md flex-1'>
              <Skeleton className='h-11 w-full' />
            </div>
            <div className='flex gap-3'>
              <Skeleton className='h-11 w-48' />
              <Skeleton className='h-11 w-48' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-40' />
          <Skeleton className='mt-2 h-4 w-60' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Table Header */}
            <div className='flex items-center justify-between border-b pb-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-16' />
            </div>
            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center justify-between py-2'>
                <Skeleton className='h-12 w-40' />
                <Skeleton className='h-6 w-28' />
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-4 w-16' />
                <div className='flex gap-2'>
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Skeleton */}
          <div className='mt-4 flex items-center justify-between'>
            <Skeleton className='h-4 w-32' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-8' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-8 w-16' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
