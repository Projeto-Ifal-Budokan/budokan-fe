export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Privilege extends Role {}

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

export type CreateUserData = Omit<User, 'id' | 'roles' | 'status'> & {
  password: string;
  phone: string;
  birthDate: Date;
  isPractitioner: boolean;
  healthObservations: string;
};
