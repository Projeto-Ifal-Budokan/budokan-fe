'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Users } from 'lucide-react';
import { AddMatriculationForm } from './add-matriculation-form';

interface AddMatriculationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMatriculationModal({
  isOpen,
  onOpenChange,
}: AddMatriculationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'>
          <Plus className='mr-2 h-4 w-4' />
          Nova Matrícula
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[95vh] max-w-6xl overflow-y-auto sm:max-w-4xl'>
        <DialogHeader className='pb-4'>
          <DialogTitle className='flex items-center gap-3 text-2xl font-bold text-gray-900'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white'>
              <Users className='h-5 w-5' />
            </div>
            Adicionar Nova Matrícula
          </DialogTitle>
          <DialogDescription className='text-base text-gray-600'>
            Preencha as informações abaixo para criar uma nova matrícula no
            sistema. Complete todos os campos obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <AddMatriculationForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
