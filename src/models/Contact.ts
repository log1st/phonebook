import { Person } from 'src/models/Person';

export enum ContactType {
  phone = 'phone',
  email = 'email',
  address = 'address'
}

export interface Contact {
  id: number;
  personId: Person['id'];
  type: ContactType;
  label?: string;
  value: string;
}
