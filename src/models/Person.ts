import { Contact } from 'src/models/Contact';
import { Department } from 'src/models/Department';

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  photoUrl: string;
}

export interface DepartmentPerson extends Person {
  position: string;
  order: number;
  contacts: Array<Contact>;
  departments: Array<Department & {
    position: DepartmentPerson['position']
  }>;
}
