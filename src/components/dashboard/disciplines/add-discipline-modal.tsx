'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { AddDisciplineForm } from './add-discipline-form';

interface AddDisciplineModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDisciplineModal({
  isOpen,
  onOpenChange,
}: AddDisciplineModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className='bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg transition-all duration-200 hover:shadow-xl'>
          <PlusCircle className='mr-2 h-4 w-4' />
          Nova Disciplina
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Adicionar Nova Disciplina
          </DialogTitle>
        </DialogHeader>
        <AddDisciplineForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
