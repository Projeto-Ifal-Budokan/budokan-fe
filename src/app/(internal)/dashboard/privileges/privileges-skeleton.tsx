import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PrivilegesSkeleton() {
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
      <div className='grid gap-4 md:grid-cols-2'>
        {[...Array(2)].map((_, i) => (
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

      {/* Search Filter Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-24' />
          <Skeleton className='mt-2 h-4 w-64' />
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-10 w-80' />
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5' />
            <Skeleton className='h-6 w-40' />
          </div>
          <Skeleton className='mt-2 h-4 w-full max-w-2xl' />
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Info Alert Skeleton */}
            <div className='flex items-start space-x-3 rounded-lg border p-4'>
              <Skeleton className='mt-0.5 h-5 w-5' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-48' />
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-3/4' />
              </div>
            </div>

            {/* Categories Skeleton */}
            {[...Array(3)].map((_, categoryIndex) => (
              <div key={categoryIndex} className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-6 w-32' />
                  <Skeleton className='h-5 w-20' />
                </div>

                <div className='rounded-lg border'>
                  <div className='space-y-4 p-4'>
                    {/* Table Header Skeleton */}
                    <div className='flex items-center justify-between'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-4 w-28' />
                      <Skeleton className='h-4 w-16' />
                    </div>

                    {/* Table Rows Skeleton */}
                    {[...Array(4)].map((_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          <Skeleton className='h-4 w-4' />
                          <Skeleton className='h-4 w-40' />
                        </div>
                        <Skeleton className='h-6 w-32' />
                        <Skeleton className='h-4 w-48' />
                        <Skeleton className='h-5 w-16' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Skeleton */}
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-48' />
              <div className='flex items-center space-x-2'>
                <Skeleton className='h-8 w-16' />
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-8 w-20' />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
