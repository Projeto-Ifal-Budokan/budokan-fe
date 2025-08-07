'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, Hourglass } from 'lucide-react';

export function AccessPending() {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-2xl space-y-8'>
        {/* Main Status Card */}
        <Card className='border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-xl'>
          <CardContent className='p-8 text-center'>
            <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg'>
              <Hourglass className='h-10 w-10 animate-pulse text-white' />
            </div>

            <h1 className='mb-4 text-3xl font-bold text-gray-900'>
              Conta em Processo de Liberação
            </h1>

            <p className='mb-6 text-lg leading-relaxed text-gray-600'>
              Sua conta foi criada com sucesso! Agora nossos administradores
              estão revisando suas informações para liberar os acessos
              apropriados para você começar a usar a plataforma.
            </p>

            {/* Progress Steps */}
            <div className='mb-8 space-y-4'>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <span>Progresso da Liberação</span>
                <span>2 de 3 etapas concluídas</span>
              </div>
              <Progress value={66} className='h-3' />
            </div>

            {/* Status Steps */}
            <div className='mb-8 space-y-4'>
              <div className='flex items-center gap-3 text-left'>
                <CheckCircle2 className='h-5 w-5 flex-shrink-0 text-green-500' />
                <span className='text-gray-700'>Conta criada com sucesso</span>
              </div>
              <div className='flex items-center gap-3 text-left'>
                <CheckCircle2 className='h-5 w-5 flex-shrink-0 text-green-500' />
                <span className='text-gray-700'>
                  Dados pessoais verificados
                </span>
              </div>
              <div className='flex items-center gap-3 text-left'>
                <Clock className='h-5 w-5 flex-shrink-0 animate-pulse text-amber-500' />
                <span className='text-gray-700'>
                  Aguardando liberação de acesso
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
