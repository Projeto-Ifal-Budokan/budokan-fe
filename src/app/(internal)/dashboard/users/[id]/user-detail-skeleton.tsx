import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserDetailSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-12 w-12 rounded-xl' />
              <div>
                <Skeleton className='h-10 w-48' />
                <Skeleton className='mt-2 h-4 w-72' />
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-10 w-40' />
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className='overflow-hidden border-0 shadow-xl'>
          <CardContent className='p-8'>
            <div className='flex flex-col items-center space-y-6 md:flex-row md:space-y-0 md:space-x-8'>
              <Skeleton className='h-24 w-24 rounded-full border-4' />
              <div className='flex-1 text-center md:text-left'>
                <div className='mb-3 flex flex-col items-center gap-3 md:flex-row'>
                  <Skeleton className='h-8 w-48' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-6 w-20' />
                  </div>
                </div>
                <div className='flex flex-col gap-2 md:flex-row md:gap-6'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-4 w-32' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className='relative overflow-hidden border-0 shadow-xl'
            >
              <div className='absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gray-100'></div>
              <CardHeader className='relative flex flex-row items-center justify-between space-y-0 pb-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-5' />
              </CardHeader>
              <CardContent className='relative'>
                <Skeleton className='h-8 w-16' />
                <Skeleton className='mt-1 h-3 w-20' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <div className='space-y-6'>
          <div className='grid w-full grid-cols-3 gap-2'>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className='h-10' />
            ))}
          </div>

          <Card className='shadow-xl'>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid gap-6 md:grid-cols-2'>
                {[...Array(6)].map((_, j) => (
                  <div key={j} className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-12 w-full' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
