import { Department } from 'src/models/Department';
import { useStore } from 'src/store';
import { DepartmentPerson, Person } from 'src/models/Person';
import { ApiResponse } from 'src/hooks/useHttp';
import { SourcePureErrors } from 'src/hooks/useErrors';

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

export type DepartmentModel = Pick<Department, 'parentId' | 'name'>

export interface UpdateDepartmentPayload {
  id: Department['id'];
  model: DepartmentModel;
}
export type UpdateDepartmentSuccessResponse = null
export type UpdateDepartmentFailureResponse = SourcePureErrors<keyof DepartmentModel>

export type CreateDepartmentPayload = DepartmentModel
export type CreateDepartmentSuccessResponse = null
export type CreateDepartmentFailureResponse = SourcePureErrors<keyof DepartmentModel>

export type RemoveDepartmentPayload = Pick<Department, 'id' | 'parentId'>
export type RemoveDepartmentSuccessResponse = null
export type RemoveDepartmentFailureResponse = SourcePureErrors<'error'>

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
  const updateDepartment = async (payload: UpdateDepartmentPayload) => (
    store.dispatch('departments/updateDepartment', payload) as Promise<ApiResponse<UpdateDepartmentSuccessResponse, UpdateDepartmentFailureResponse>>
  );
  const createDepartment = async (payload: CreateDepartmentPayload) => (
    store.dispatch('departments/createDepartment', payload) as Promise<ApiResponse<CreateDepartmentSuccessResponse, CreateDepartmentFailureResponse>>
  );
  const removeDepartment = async (payload: RemoveDepartmentPayload) => (
    store.dispatch('departments/removeDepartment', payload) as Promise<ApiResponse<RemoveDepartmentSuccessResponse, RemoveDepartmentFailureResponse>>
  );

  return {
    fetchDepartments,
    fetchDepartment,
    fetchDepartmentPerson,
    fetchDepartmentPersons,
    updateDepartment,
    createDepartment,
    removeDepartment,
  };
};
