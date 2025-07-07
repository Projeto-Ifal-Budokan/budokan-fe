export interface Role {
  id: number;
  name: string;
  description: string;
}

export type Privilege = Role;

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: number;
  email: string;
  firstName: string;
  surname: string;
  status: UserStatus;
  roles: Role[];
  privileges: Privilege[];
  birthDate: string;
  phone: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
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
