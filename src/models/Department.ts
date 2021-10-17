export interface Department {
  id: number;
  name: string;
  parentId: Department['id'] | null;
  order: number;
  children?: Array<Department>
}
