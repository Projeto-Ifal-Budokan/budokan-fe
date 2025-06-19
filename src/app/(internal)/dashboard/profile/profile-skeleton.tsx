import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='mt-2 h-4 w-72' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>

      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center space-x-6'>
            <Skeleton className='h-24 w-24 rounded-full' />
            <div className='flex-1 space-y-3'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-4 w-32' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Content Skeleton */}
      <div className='space-y-6'>
        <div className='grid w-full grid-cols-4 gap-2'>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className='h-10' />
          ))}
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent className='space-y-4'>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-10 w-full' />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
