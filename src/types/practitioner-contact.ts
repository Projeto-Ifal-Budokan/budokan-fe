export interface PractitionerContact {
  id: number;
  idPractitioner: number;
  phone: string;
  relationship: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePractitionerContactData = {
  phone: string;
  relationship: string;
};

export type UpdatePractitionerContactData = {
  phone: string;
  relationship: string;
};
