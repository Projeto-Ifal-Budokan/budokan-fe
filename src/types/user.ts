export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  surname: string;
  status: 'active' | 'inactive';
  roles: Role[];
}

export type CreateUserData = Omit<User, 'id' | 'roles' | 'status'> & {
  password: string;
  phone: string;
  birthDate: Date;
  isPractitioner: boolean;
  healthObservations: string;
};
