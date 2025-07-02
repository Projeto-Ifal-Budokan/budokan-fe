import { Skeleton } from '@/components/ui/skeleton';

export function SessionsSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <Skeleton className='h-8 w-32' />
          <Skeleton className='mt-2 h-4 w-64' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-4' />
            </div>
            <Skeleton className='mt-2 h-8 w-12' />
            <Skeleton className='mt-2 h-3 w-20' />
          </div>
        ))}
      </div>

      <div className='space-y-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <Skeleton className='h-10 w-full md:w-64' />
          <Skeleton className='h-10 w-full md:w-48' />
        </div>

        <div className='rounded-md border'>
          <div className='border-b p-4'>
            <div className='grid grid-cols-5 gap-4'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-16' />
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='border-b p-4 last:border-b-0'>
              <div className='grid grid-cols-5 gap-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <div className='flex gap-2'>
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
