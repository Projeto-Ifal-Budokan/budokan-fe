import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateUserData } from '@/types/user';
import {
  Calendar,
  Contact,
  Lock,
  LucideIcon,
  Mail,
  Phone,
  Plus,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface AddUserFormProps {
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
}

interface EmergencyContact {
  phone: string;
  relationship: string;
}

type FormData = CreateUserData;

// Move FormField component outside to prevent recreation on re-renders
const FormField = ({
  icon: Icon,
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}: {
  icon: LucideIcon;
  label: string;
  id: keyof FormData;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => (
  <div className='space-y-2'>
    <Label
      htmlFor={id}
      className='flex items-center gap-2 text-sm font-medium text-gray-700'
    >
      <Icon className='h-4 w-4 text-blue-600' />
      {label}
      {required && (
        <Badge variant='secondary' className='text-xs'>
          Obrigatório
        </Badge>
      )}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='h-11 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
    />
  </div>
);

export function AddUserForm({ onCancel, onSubmit }: AddUserFormProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    firstName: '',
    surname: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    profileImageUrl: '',
    emergencyContacts: [],
    isPractitioner: false,
    healthObservations: '',
    profileImageUrl: '',
  });

  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([{ phone: '', relationship: '' }]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { phone: '', relationship: '' },
    ]);
  };

  const removeEmergencyContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const updateEmergencyContact = (
    index: number,
    field: keyof EmergencyContact,
    value: string
  ) => {
    setEmergencyContacts((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600'>
            <UserPlus className='h-8 w-8 text-white' />
          </div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Adicionar Novo Usuário
          </h1>
          <p className='mx-auto max-w-md text-gray-600'>
            Crie uma nova conta preenchendo as informações abaixo
          </p>
        </div>

        <form className='space-y-6'>
          {/* Personal Information Card */}
          <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-3 text-xl'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <User className='h-5 w-5 text-blue-600' />
                </div>
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  icon={User}
                  label='Nome'
                  id='firstName'
                  placeholder='Digite seu nome'
                  value={formData.firstName}
                  onChange={(value) => updateFormData('firstName', value)}
                  required
                />
                <FormField
                  icon={User}
                  label='Sobrenome'
                  id='surname'
                  placeholder='Digite seu sobrenome'
                  value={formData.surname}
                  onChange={(value) => updateFormData('surname', value)}
                  required
                />
                <FormField
                  icon={Mail}
                  label='Email'
                  id='email'
                  type='email'
                  placeholder='seu.email@ifal.edu.br'
                  value={formData.email}
                  onChange={(value) => updateFormData('email', value)}
                  required
                />
                <FormField
                  icon={Phone}
                  label='Telefone'
                  id='phone'
                  placeholder='(82) 9 9999-9999'
                  value={formData.phone}
                  onChange={(value) => updateFormData('phone', value)}
                  required
                />
                <FormField
                  icon={Calendar}
                  label='Data de Nascimento'
                  id='birthDate'
                  type='date'
                  placeholder=''
                  value={formData.birthDate}
                  onChange={(value) => updateFormData('birthDate', value)}
                  required
                />
                <FormField
                  icon={Lock}
                  label='Senha'
                  id='password'
                  type='password'
                  placeholder='Crie uma senha segura'
                  value={formData.password}
                  onChange={(value) => updateFormData('password', value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts Card */}
          <Card className='border-0 bg-white/80 shadow-lg backdrop-blur-sm'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-3 text-xl'>
                  <div className='rounded-lg bg-orange-100 p-2'>
                    <Contact className='h-5 w-5 text-orange-600' />
                  </div>
                  Contatos de Emergência
                </CardTitle>
                <Button
                  type='button'
                  onClick={addEmergencyContact}
                  size='sm'
                  className='bg-green-600 text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg'
                >
                  <Plus className='mr-1 h-4 w-4' />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className='relative rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4 transition-all duration-200 hover:shadow-md'
                >
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor={`emergency-phone-${index}`}
                        className='flex items-center gap-2 text-sm font-medium text-gray-700'
                      >
                        <Phone className='h-4 w-4 text-orange-600' />
                        Telefone
                      </Label>
                      <Input
                        id={`emergency-phone-${index}`}
                        placeholder='(82) 9 9999-9999'
                        value={contact.phone}
                        onChange={(e) =>
                          updateEmergencyContact(index, 'phone', e.target.value)
                        }
                        className='h-10 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor={`emergency-relationship-${index}`}
                        className='flex items-center gap-2 text-sm font-medium text-gray-700'
                      >
                        <Contact className='h-4 w-4 text-orange-600' />
                        Relacionamento
                      </Label>
                      <div className='flex gap-2'>
                        <Input
                          id={`emergency-relationship-${index}`}
                          placeholder='Ex: Mãe, Pai, Irmão(ã)'
                          value={contact.relationship}
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              'relationship',
                              e.target.value
                            )
                          }
                          className='h-10 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                        />
                        {emergencyContacts.length > 1 && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => removeEmergencyContact(index)}
                            className='h-10 border-red-200 px-3 text-red-600 transition-all duration-200 hover:bg-red-50'
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex flex-col gap-4 pt-6 sm:flex-row'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='h-12 flex-1 border-gray-300 transition-all duration-200 hover:bg-gray-50 sm:flex-none sm:px-8'
            >
              Cancelar
            </Button>
            <Button
              type='button'
              onClick={() => onSubmit(formData)}
              className='h-12 flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl sm:flex-none sm:px-8'
            >
              <UserPlus className='mr-2 h-5 w-5' />
              Criar Usuário
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
