'use client';

import {
  CreatePractitionerContactData,
  UpdatePractitionerContactData,
} from '@/types/practitioner-contact';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { practitionerContactsService } from '../services/practitioner-contacts-service';

export const practitionerContactKeys = {
  all: ['practitioner-contacts'] as const,
  detail: (id: string) => [...practitionerContactKeys.all, Number(id)] as const,
  lists: () => [...practitionerContactKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...practitionerContactKeys.lists(), { filters }] as const,
  details: () => [...practitionerContactKeys.all, 'detail'] as const,
} as const;

const getPractitionerContactQuery = (id: string) => ({
  queryKey: practitionerContactKeys.detail(id),
  queryFn: async () => {
    const response =
      await practitionerContactsService.getPractitionerContact(id);
    return response.data;
  },
});

const listPractitionerContactsQuery = (
  page: number = 1,
  pageSize: number = 10,
  filters?: { idPractitioner?: number }
) => ({
  queryKey: practitionerContactKeys.list({ page, pageSize, ...filters }),
  queryFn: async () => {
    const response = await practitionerContactsService.getPractitionerContacts(
      page,
      pageSize,
      filters
    );
    return response;
  },
});

export function useManagePractitionerContacts() {
  const queryClient = useQueryClient();

  const usePractitionerContact = (id: string) => {
    return useQuery({
      ...getPractitionerContactQuery(id),
      enabled: !!id, // Only run if id exists
    });
  };

  const usePractitionerContacts = (
    page: number = 1,
    pageSize: number = 10,
    filters?: { idPractitioner?: number }
  ) => {
    return useQuery({
      ...listPractitionerContactsQuery(page, pageSize, filters),
    });
  };

  const fetchPractitionerContact = async (id: string) => {
    return await queryClient.fetchQuery(getPractitionerContactQuery(id));
  };

  const fetchPractitionerContacts = async (
    page: number = 1,
    pageSize: number = 10,
    filters?: { idPractitioner?: number }
  ) => {
    return await queryClient.fetchQuery(
      listPractitionerContactsQuery(page, pageSize, filters)
    );
  };

  const createPractitionerContact = useMutation({
    mutationFn: ({
      practitionerId,
      data,
    }: {
      practitionerId: number;
      data: CreatePractitionerContactData;
    }) =>
      practitionerContactsService.createPractitionerContact(
        practitionerId,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practitionerContactKeys.all });
      toast.success('Contato criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar contato');
    },
  });

  const updatePractitionerContact = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePractitionerContactData;
    }) => practitionerContactsService.updatePractitionerContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practitionerContactKeys.all });
      toast.success('Contato atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar contato');
    },
  });

  const deletePractitionerContact = useMutation({
    mutationFn: practitionerContactsService.deletePractitionerContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practitionerContactKeys.all });
      toast.success('Contato excluído com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir contato');
    },
  });

  return {
    usePractitionerContact,
    usePractitionerContacts,
    fetchPractitionerContact,
    fetchPractitionerContacts,
    createPractitionerContact,
    updatePractitionerContact,
    deletePractitionerContact,
  };
}
