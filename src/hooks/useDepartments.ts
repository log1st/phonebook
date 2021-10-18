import { Department } from 'src/models/Department';
import { useStore } from 'src/store';
import { DepartmentPerson, Person } from 'src/models/Person';
import { ApiResponse } from 'src/hooks/useHttp';
import { SourcePureErrors } from 'src/hooks/useErrors';
import { Contact } from 'src/models/Contact';

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

export type UpdateDepartmentsOrderPayload = {
  id: Department['id'] | null;
  order: Array<Department['id']>
}
export type UpdateDepartmentsOrderSuccessResponse = null;
export type UpdateDepartmentsOrderFailureResponse = SourcePureErrors<'order'>;

export interface PersonModel {
  person: Omit<Person, 'id' | 'photoUrl'> & {
    photoUrl: Person['photoUrl'] | File | null;
  };
  positions: {
    [key in Department['id']]: DepartmentPerson['position']
  };
  departments: Array<Department['id']>;
  contacts: Array<Omit<Contact, 'id' | 'personId'> | {id: string}>
}

export interface UpdatePersonPayload {
  id: Person['id'];
  model: PersonModel;
}
export type UpdatePersonSuccessResponse = null;
export type UpdatePersonFailureResponse = SourcePureErrors<keyof PersonModel['person'] | keyof Omit<PersonModel, 'person'>>;

export type CreatePersonPayload = PersonModel
export type CreatePersonSuccessResponse = null;
export type CreatePersonFailureResponse = SourcePureErrors<keyof PersonModel['person'] | keyof Omit<PersonModel, 'person'>>;

export type RemovePersonPayload = {
  id: Person['id'];
  departmentId: Department['id'];
}
export type RemovePersonSuccessResponse = null;
export type RemovePersonFailureResponse = SourcePureErrors<'error'>

export type UpdatePersonsOrderPayload = {
  id: Department['id'];
  order: Array<Person['id']>;
}
export type UpdatePersonsOrderSuccessResponse = null;
export type UpdatePersonsOrderFailureResponse = SourcePureErrors<'error'>

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
  const updateDepartmentsOrder = async (payload: UpdateDepartmentsOrderPayload) => (
    store.dispatch('departments/updateDepartmentsOrder', payload) as Promise<ApiResponse<UpdateDepartmentsOrderSuccessResponse, UpdateDepartmentsOrderFailureResponse>>
  );
  const updatePerson = async (payload: UpdatePersonPayload) => (
    store.dispatch('departments/updatePerson', payload) as Promise<ApiResponse<UpdatePersonSuccessResponse, UpdatePersonFailureResponse>>
  );
  const createPerson = async (payload: CreatePersonPayload) => (
    store.dispatch('departments/createPerson', payload) as Promise<ApiResponse<CreatePersonSuccessResponse, CreatePersonFailureResponse>>
  );
  const removePerson = async (payload: RemovePersonPayload) => (
    store.dispatch('departments/removePerson', payload) as Promise<ApiResponse<RemovePersonSuccessResponse, RemovePersonFailureResponse>>
  );
  const updatePersonsOrder = async (payload: UpdatePersonsOrderPayload) => (
    store.dispatch('departments/updatePersonsOrder', payload) as Promise<ApiResponse<UpdatePersonsOrderSuccessResponse, UpdatePersonsOrderFailureResponse>>
  );

  return {
    fetchDepartments,
    fetchDepartment,
    fetchDepartmentPerson,
    fetchDepartmentPersons,
    updateDepartment,
    createDepartment,
    removeDepartment,
    updateDepartmentsOrder,
    updatePerson,
    createPerson,
    removePerson,
    updatePersonsOrder,
  };
};
