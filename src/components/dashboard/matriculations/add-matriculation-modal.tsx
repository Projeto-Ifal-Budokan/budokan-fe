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
import { Plus } from 'lucide-react';
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
      <DialogContent className='max-h-[95vh] max-w-6xl overflow-y-auto p-0 md:min-w-3xl'>
        <div className='sticky top-0 z-10 border-b border-gray-100 bg-white px-8 py-6'>
          <DialogHeader className='space-y-2'>
            <DialogTitle className='text-2xl font-semibold text-gray-900'>
              Criar Nova Matrícula
            </DialogTitle>
            <DialogDescription className='text-base text-gray-600'>
              Configure a matrícula selecionando o usuário, tipo, disciplina e
              graduação
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='px-8 pb-8'>
          <AddMatriculationForm onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
