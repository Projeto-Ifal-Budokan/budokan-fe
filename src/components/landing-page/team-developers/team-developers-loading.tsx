export function TeamDevelopersLoading() {
  return (
    <section id='team-developers' className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <div className='mx-auto mb-4 h-8 w-96 animate-pulse rounded bg-gray-200'></div>
          <div className='mx-auto mb-6 h-1 w-20 animate-pulse rounded bg-gray-200'></div>
          <div className='mx-auto max-w-3xl space-y-2'>
            <div className='h-4 w-full animate-pulse rounded bg-gray-200'></div>
            <div className='mx-auto h-4 w-3/4 animate-pulse rounded bg-gray-200'></div>
          </div>

          {/* Stats loading */}
          <div className='mt-8 flex items-center justify-center gap-8'>
            <div className='h-4 w-32 animate-pulse rounded bg-gray-200'></div>
            <div className='h-4 w-28 animate-pulse rounded bg-gray-200'></div>
            <div className='h-4 w-24 animate-pulse rounded bg-gray-200'></div>
          </div>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='relative overflow-hidden rounded-lg bg-blue-50 p-6 text-center'
            >
              {/* Shimmer effect */}
              <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>

              <div className='relative mx-auto mb-4 h-32 w-32'>
                <div className='h-full w-full animate-pulse rounded-full border-4 border-white bg-gray-200 shadow-md'></div>
              </div>
              <div className='mx-auto mb-2 h-6 w-32 animate-pulse rounded bg-gray-200'></div>
              <div className='mx-auto mb-3 h-6 w-24 animate-pulse rounded-full bg-gray-200'></div>
              <div className='mb-2 h-4 w-full animate-pulse rounded bg-gray-200'></div>
              <div className='mx-auto mb-4 h-4 w-3/4 animate-pulse rounded bg-gray-200'></div>
              <div className='mx-auto mb-4 h-3 w-20 animate-pulse rounded bg-gray-200'></div>
              <div className='flex justify-center gap-4 border-t border-gray-200 pt-3'>
                <div className='h-3 w-16 animate-pulse rounded bg-gray-200'></div>
                <div className='h-3 w-20 animate-pulse rounded bg-gray-200'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
