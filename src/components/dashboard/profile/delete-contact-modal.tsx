'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PractitionerContact } from '@/types/practitioner-contact';
import { AlertTriangle, Phone, Trash2 } from 'lucide-react';

interface DeleteContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: PractitionerContact | null;
  isPending: boolean;
  onConfirm: () => void;
}

export function DeleteContactModal({
  isOpen,
  onOpenChange,
  contact,
  isPending,
  onConfirm,
}: DeleteContactModalProps) {
  const formatPhone = (phone: string) => {
    if (!phone) return 'Não informado';
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
  };

  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg border-0 shadow-2xl'>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex items-center gap-3 text-xl'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
            </div>
            Excluir Contato de Emergência
          </DialogTitle>
          <DialogDescription className='text-base text-gray-600'>
            Esta ação não pode ser desfeita. O contato será permanentemente
            removido.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='flex items-center gap-4 rounded-xl bg-gray-50 p-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <Phone className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <div className='font-semibold text-gray-900'>
                {contact.relationship}
              </div>
              <div className='text-sm text-gray-500'>
                {formatPhone(contact.phone)}
              </div>
            </div>
          </div>

          <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
            <div className='flex items-start gap-3'>
              <Trash2 className='mt-0.5 h-5 w-5 text-red-600' />
              <div>
                <p className='text-sm font-medium text-red-800'>
                  <strong>Atenção:</strong> Esta ação é irreversível
                </p>
                <ul className='mt-2 space-y-1 text-sm text-red-700'>
                  <li>• O contato será permanentemente removido</li>
                  <li>• Não será possível recuperar essas informações</li>
                  <li>
                    • Você pode adicionar um novo contato a qualquer momento
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className='flex gap-3 pt-4'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className='px-6'
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            variant='destructive'
            className='px-6'
          >
            {isPending ? 'Excluindo...' : 'Excluir Contato'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
