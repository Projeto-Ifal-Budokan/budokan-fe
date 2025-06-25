import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { CreateInstructorRequest } from '@/types/instructor';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface AddInstructorFormProps {
  onSuccess: () => void;
}

export function AddInstructorForm({ onSuccess }: AddInstructorFormProps) {
  const [formData, setFormData] = useState<CreateInstructorRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    biography: '',
  });

  //   const { createInstructor } = useManageInstructors();

  const handleInputChange = (
    field: keyof CreateInstructorRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      //   await createInstructor.mutateAsync(formData);
      onSuccess();
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        biography: '',
      });
    } catch (error) {
      console.error('Error creating instructor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='firstName'>
            Nome <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='firstName'
            placeholder='Ex: João'
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='lastName'>
            Sobrenome <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='lastName'
            placeholder='Ex: Silva'
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>
          Email <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='email'
          type='email'
          placeholder='joao.silva@email.com'
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='phone'>Telefone</Label>
        <Input
          id='phone'
          placeholder='(11) 99999-9999'
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='biography'>Biografia</Label>
        <Textarea
          id='biography'
          placeholder='Breve descrição sobre a experiência e formação do instrutor...'
          value={formData.biography}
          onChange={(e) => handleInputChange('biography', e.target.value)}
          rows={4}
        />
      </div>

      <div className='flex justify-end gap-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onSuccess}
          // disabled={createInstructor.isPending}
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          // disabled={createInstructor.isPending}
          className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        >
          {/* {createInstructor.isPending ? 'Criando...' : 'Criar Instrutor'} */}
          Criar Instrutor
        </Button>
      </div>
    </form>
  );
}
