export interface Role {
  id: number;
  name: string;
  description: string;
}

export type Privilege = Role;

export interface User {
  id: number;
  email: string;
  firstName: string;
  surname: string;
  status: 'active' | 'inactive';
  roles: Role[];
  privileges: Privilege[];
  birthDate: string;
  phone: string;
}

export type CreateUserData = Omit<
  User,
  'id' | 'roles' | 'status' | 'privileges'
> & {
  password: string;
  phone: string;
  birthDate: string;
  isPractitioner: boolean;
  healthObservations: string;
  emergencyContacts: {
    phone: string;
    relationship: string;
  }[];
};
