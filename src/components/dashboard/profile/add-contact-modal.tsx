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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useManagePractitionerContacts } from '@/lib/api/queries/use-manage-practitioner-contacts';
import { CreatePractitionerContactData } from '@/types/practitioner-contact';
import { Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface AddContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  practitionerId: number;
}

const relationshipOptions = [
  { value: 'Pai', label: 'Pai' },
  { value: 'Mãe', label: 'Mãe' },
  { value: 'Irmão(ã)', label: 'Irmão(ã)' },
  { value: 'Cônjuge', label: 'Cônjuge' },
  { value: 'Filho(a)', label: 'Filho(a)' },
  { value: 'Avô/Avó', label: 'Avô/Avó' },
  { value: 'Tio(a)', label: 'Tio(a)' },
  { value: 'Primo(a)', label: 'Primo(a)' },
  { value: 'Amigo(a)', label: 'Amigo(a)' },
  { value: 'Outro', label: 'Outro' },
];

export function AddContactModal({
  isOpen,
  onOpenChange,
  practitionerId,
}: AddContactModalProps) {
  const [formData, setFormData] = useState<CreatePractitionerContactData>({
    phone: '',
    relationship: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createPractitionerContact } = useManagePractitionerContacts();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else {
      const phoneRegex = /^\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Telefone deve ter um formato válido';
      }
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relacionamento é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createPractitionerContact.mutateAsync({
        practitionerId,
        data: {
          ...formData,
          phone: formData.phone.replace(/\D/g, ''), // Remove formatting
        },
      });

      // Reset form and close modal
      setFormData({ phone: '', relationship: '' });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ phone: '', relationship: '' });
    setErrors({});
    onOpenChange(false);
  };

  const formatPhoneInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);

    if (match) {
      const formatted = [match[1], match[2], match[3]]
        .filter(Boolean)
        .join('')
        .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        .replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      return formatted;
    }

    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md border-0 shadow-2xl'>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex items-center gap-3 text-xl'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
              <UserPlus className='h-5 w-5 text-blue-600' />
            </div>
            Adicionar Contato de Emergência
          </DialogTitle>
          <DialogDescription className='text-gray-600'>
            Adicione um contato para emergências e situações importantes.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='relationship' className='text-sm font-medium'>
              Relacionamento *
            </Label>
            <Select
              value={formData.relationship}
              onValueChange={(value) =>
                setFormData({ ...formData, relationship: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione o relacionamento' />
              </SelectTrigger>
              <SelectContent>
                {relationshipOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.relationship && (
              <p className='text-sm text-red-600'>{errors.relationship}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone' className='text-sm font-medium'>
              Telefone *
            </Label>
            <Input
              id='phone'
              type='tel'
              placeholder='(11) 99999-9999'
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                setFormData({ ...formData, phone: formatted });
              }}
              className={errors.phone ? 'border-red-300' : ''}
            />
            {errors.phone && (
              <p className='text-sm text-red-600'>{errors.phone}</p>
            )}
          </div>
        </div>

        <DialogFooter className='flex gap-3 pt-4'>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={createPractitionerContact.isPending}
            className='px-6'
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createPractitionerContact.isPending}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6'
          >
            {createPractitionerContact.isPending ? (
              'Adicionando...'
            ) : (
              <>
                <Plus className='mr-2 h-4 w-4' />
                Adicionar Contato
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
