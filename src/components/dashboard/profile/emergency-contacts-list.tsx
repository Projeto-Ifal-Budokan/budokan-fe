'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useManagePractitionerContacts } from '@/lib/api/queries/use-manage-practitioner-contacts';
import { PractitionerContact } from '@/types/practitioner-contact';
import { Edit3, Phone, Plus, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { AddContactModal } from './add-contact-modal';
import { DeleteContactModal } from './delete-contact-modal';
import { EditContactModal } from './edit-contact-modal';

interface EmergencyContactsListProps {
  userId: number;
}

export function EmergencyContactsList({ userId }: EmergencyContactsListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] =
    useState<PractitionerContact | null>(null);

  const { usePractitionerContacts, deletePractitionerContact } =
    useManagePractitionerContacts();

  const { data: contactsResponse, isLoading } = usePractitionerContacts(1, 50, {
    idPractitioner: userId,
  });

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

  const handleEditContact = (contact: PractitionerContact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const handleDeleteContact = (contact: PractitionerContact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedContact) {
      await deletePractitionerContact.mutateAsync(
        selectedContact.id.toString()
      );
      setIsDeleteModalOpen(false);
      setSelectedContact(null);
    }
  };

  if (isLoading) {
    return (
      <Card className='shadow-xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Phone className='h-5 w-5' />
            Contatos de Emergência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <div className='text-gray-500'>Carregando contatos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className='shadow-xl'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Phone className='h-5 w-5' />
              Contatos de Emergência
            </CardTitle>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              size='sm'
              className='bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all hover:scale-105'
            >
              <Plus className='mr-2 h-4 w-4' />
              Adicionar Contato
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {contactsResponse?.data.count === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                <UserPlus className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Nenhum contato de emergência
              </h3>
              <p className='mb-4 text-gray-500'>
                Adicione contatos para emergências e situações importantes.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className='bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
              >
                <Plus className='mr-2 h-4 w-4' />
                Adicionar Primeiro Contato
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {contactsResponse?.data.items.map((contact) => (
                <div
                  key={contact.id}
                  className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-md'
                >
                  <div className='flex items-center gap-4'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                      <Phone className='h-5 w-5 text-blue-600' />
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900'>
                        {contact.relationship}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {formatPhone(contact.phone)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEditContact(contact)}
                    >
                      <Edit3 className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDeleteContact(contact)}
                      className='text-red-600 hover:bg-red-50 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddContactModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        practitionerId={userId}
      />

      <EditContactModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        contact={selectedContact}
      />

      <DeleteContactModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        contact={selectedContact}
        isPending={deletePractitionerContact.isPending}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
