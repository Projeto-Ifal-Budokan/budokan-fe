'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupSuccessPage() {
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8'>
      <div className='w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg'>
        <div className='mb-6 flex justify-center'>
          <div className='rounded-full bg-green-100 p-3'>
            <CheckCircle2 className='h-12 w-12 text-green-600' />
          </div>
        </div>

        <h1 className='mb-4 text-2xl font-bold text-gray-900'>
          Conta criada com sucesso!
        </h1>

        <p className='mb-8 text-gray-600'>
          Aguarde o administrador ativa-la para você poder ter acesso!
        </p>

        <Link href='/login'>
          <Button className='w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950'>
            Voltar para o login
          </Button>
        </Link>
      </div>
    </div>
  );
}
