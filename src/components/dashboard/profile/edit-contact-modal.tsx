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
import {
  PractitionerContact,
  UpdatePractitionerContactData,
} from '@/types/practitioner-contact';
import { Edit3, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EditContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: PractitionerContact | null;
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

export function EditContactModal({
  isOpen,
  onOpenChange,
  contact,
}: EditContactModalProps) {
  const [formData, setFormData] = useState<UpdatePractitionerContactData>({
    phone: '',
    relationship: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { updatePractitionerContact } = useManagePractitionerContacts();

  useEffect(() => {
    if (contact && isOpen) {
      const formattedPhone = formatPhoneDisplay(contact.phone);
      setFormData({
        phone: formattedPhone,
        relationship: contact.relationship,
      });
      setErrors({});
    }
  }, [contact, isOpen]);

  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
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
    if (!contact || !validateForm()) return;

    try {
      await updatePractitionerContact.mutateAsync({
        id: contact.id.toString(),
        data: {
          ...formData,
          phone: formData.phone.replace(/\D/g, ''), // Remove formatting
        },
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleCancel = () => {
    if (contact) {
      const formattedPhone = formatPhoneDisplay(contact.phone);
      setFormData({
        phone: formattedPhone,
        relationship: contact.relationship,
      });
    }
    setErrors({});
    onOpenChange(false);
  };

  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md border-0 shadow-2xl'>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex items-center gap-3 text-xl'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
              <Edit3 className='h-5 w-5 text-blue-600' />
            </div>
            Editar Contato de Emergência
          </DialogTitle>
          <DialogDescription className='text-gray-600'>
            Atualize as informações do contato de emergência.
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
            disabled={updatePractitionerContact.isPending}
            className='px-6'
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updatePractitionerContact.isPending}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6'
          >
            {updatePractitionerContact.isPending ? (
              'Salvando...'
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
