'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Matrícula</DialogTitle>
        </DialogHeader>
        <AddMatriculationForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
