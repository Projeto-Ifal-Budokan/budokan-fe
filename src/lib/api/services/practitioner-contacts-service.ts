import { api, ApiPaginatedResponse, ApiResponse } from '@/lib/api/api';
import { Response } from '@/types/api';
import {
  CreatePractitionerContactData,
  PractitionerContact,
  UpdatePractitionerContactData,
} from '@/types/practitioner-contact';

export const practitionerContactsService = {
  getPractitionerContact: async (
    id: string
  ): Promise<ApiResponse<PractitionerContact>> => {
    const response = await api.get<PractitionerContact>(
      `/practitioner-contacts/${id}`
    );
    return response;
  },

  getPractitionerContacts: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      idPractitioner?: number;
    }
  ): Promise<ApiResponse<ApiPaginatedResponse<PractitionerContact[]>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (filters?.idPractitioner) {
      params.append('idPractitioner', filters.idPractitioner.toString());
    }

    const response = await api.get<ApiPaginatedResponse<PractitionerContact[]>>(
      `/practitioner-contacts/?${params.toString()}`
    );
    return response;
  },

  createPractitionerContact: async (
    practitionerId: number,
    data: CreatePractitionerContactData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.post<Response>(
      `/practitioner-contacts/practitioner/${practitionerId}`,
      data
    );
    return response;
  },

  updatePractitionerContact: async (
    id: string,
    data: UpdatePractitionerContactData
  ): Promise<ApiResponse<Response>> => {
    const response = await api.put<Response>(
      `/practitioner-contacts/${id}`,
      data
    );
    return response;
  },

  deletePractitionerContact: async (
    id: string
  ): Promise<ApiResponse<Response>> => {
    const response = await api.delete<Response>(`/practitioner-contacts/${id}`);
    return response;
  },
};
