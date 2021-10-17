import { Department } from 'src/models/Department';
import { useStore } from 'src/store';
import { DepartmentPerson, Person } from 'src/models/Person';
import { ApiResponse } from 'src/hooks/useHttp';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FetchDepartmentsPayload {
  parentId?: null | Department['id'];
  tree?: boolean;
}
export interface FetchDepartmentsResponse {
  departments: Array<Department>
}

export interface FetchDepartmentPayload {
  id: Department['id'];
}
export type FetchDepartmentResponse = Department

export interface FetchDepartmentPersonsPayload {
  id: Department['id'];
}
export type FetchDepartmentPersonsResponse = {
  persons: Array<DepartmentPerson>
}

export interface FetchDepartmentPersonPayload {
  id: Department['id'];
  personId: Person['id'];
}
export type FetchDepartmentPersonResponse = DepartmentPerson

export type DepartmentModel = Omit<Department, 'id'>

export interface UpdateDepartmentPayload {
  id: Department['id'];
  model: DepartmentModel;
}

export const useDepartments = () => {
  const store = useStore();

  const fetchDepartments = async ({ tree = true, parentId }: FetchDepartmentsPayload = { }) => (
    store.dispatch('departments/fetchDepartments', { tree, parentId }) as Promise<ApiResponse<FetchDepartmentsResponse>>
  );
  const fetchDepartment = async (payload: FetchDepartmentPayload) => (
    store.dispatch('departments/fetchDepartment', payload) as Promise<ApiResponse<FetchDepartmentResponse>>
  );
  const fetchDepartmentPersons = async (payload: FetchDepartmentPersonsPayload) => (
    store.dispatch('departments/fetchDepartmentPersons', payload) as Promise<ApiResponse<FetchDepartmentPersonsResponse>>
  );
  const fetchDepartmentPerson = async (payload: FetchDepartmentPersonPayload) => (
    store.dispatch('departments/fetchDepartmentPerson', payload) as Promise<ApiResponse<FetchDepartmentPersonResponse>>
  );

  return {
    fetchDepartments,
    fetchDepartment,
    fetchDepartmentPerson,
    fetchDepartmentPersons,
  };
};
