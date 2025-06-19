import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center'>
        <AlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
        <h1 className='text-2xl font-bold'>Acesso Negado</h1>
        <p className='text-muted-foreground mb-4'>
          Você não tem permissão para acessar esta página.
        </p>
        <Button asChild>
          <Link href='/dashboard'>Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
