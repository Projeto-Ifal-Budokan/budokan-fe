import { Button } from '@/components/ui/button';

export const ContactSection = () => {
  return (
    <section id='contact' className='bg-blue-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>
            Entre em Contatoo
          </h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Estamos à disposição para esclarecer suas dúvidas e fornecer mais
            informações sobre nossas modalidades e horários.
          </p>
        </div>

        <div className='grid gap-12 md:grid-cols-2'>
          <div>
            <form className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='name'
                    className='mb-1 block text-sm font-medium text-gray-700'
                  >
                    Nome
                  </label>
                  <input
                    type='text'
                    id='name'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='mb-1 block text-sm font-medium text-gray-700'
                  >
                    E-mail
                  </label>
                  <input
                    type='email'
                    id='email'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='subject'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Assunto
                </label>
                <input
                  type='text'
                  id='subject'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>
              <div>
                <label
                  htmlFor='message'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Mensagem
                </label>
                <textarea
                  id='message'
                  rows={5}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>
              <Button className='bg-primary hover:bg-primary/90 w-full border-0 py-3 text-white'>
                Enviar Mensagem
              </Button>
            </form>
          </div>
          <div>
            <div className='rounded-lg bg-white p-6 shadow-md'>
              <h3 className='mb-4 text-xl font-bold text-blue-900'>
                Informações de Contato
              </h3>
              <div className='space-y-4'>
                <div className='flex items-start'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-primary mt-0.5 mr-3 h-5 w-5'
                  >
                    <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
                    <circle cx='12' cy='10' r='3' />
                  </svg>
                  <div>
                    <h4 className='font-bold text-blue-900'>Endereço</h4>
                    <p className='text-gray-600'>
                      Rua das Artes Marciais, 123 - São Paulo, SP
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-primary mt-0.5 mr-3 h-5 w-5'
                  >
                    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                  </svg>
                  <div>
                    <h4 className='font-bold text-blue-900'>Telefone</h4>
                    <p className='text-gray-600'>(11) 99999-9999</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-primary mt-0.5 mr-3 h-5 w-5'
                  >
                    <rect width='20' height='16' x='2' y='4' rx='2' />
                    <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
                  </svg>
                  <div>
                    <h4 className='font-bold text-blue-900'>E-mail</h4>
                    <p className='text-gray-600'>contato@budokan.com.br</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-primary mt-0.5 mr-3 h-5 w-5'
                  >
                    <rect width='18' height='18' x='3' y='3' rx='2' />
                    <path d='M21 9H3' />
                    <path d='M9 21V9' />
                  </svg>
                  <div>
                    <h4 className='font-bold text-blue-900'>
                      Horário de Funcionamento
                    </h4>
                    <p className='text-gray-600'>
                      Segunda a Sexta: 16:00 - 21:30
                    </p>
                    <p className='text-gray-600'>Sábado: 09:00 - 16:00</p>
                    <p className='text-gray-600'>Domingo: 09:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
