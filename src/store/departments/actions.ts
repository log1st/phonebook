import { ActionTree } from 'vuex';
import {
  CreateDepartmentFailureResponse,
  CreateDepartmentPayload, CreateDepartmentSuccessResponse,
  FetchDepartmentPayload,
  FetchDepartmentPersonPayload, FetchDepartmentPersonResponse,
  FetchDepartmentPersonsPayload,
  FetchDepartmentPersonsResponse,
  FetchDepartmentResponse,
  FetchDepartmentsPayload,
  FetchDepartmentsResponse,
  RemoveDepartmentFailureResponse,
  RemoveDepartmentPayload,
  RemoveDepartmentSuccessResponse,
  UpdateDepartmentFailureResponse,
  UpdateDepartmentPayload,
  UpdateDepartmentSuccessResponse,
} from 'src/hooks/useDepartments';
import { api } from 'boot/axios';
import { Department } from 'src/models/Department';
import { SignalType } from 'src/hooks/useSignal';
import { StateInterface } from '../index';
import { DepartmentsStateInterface } from './state';

function listToTree(list: Array<Department>) {
  const map = {} as {
    [key in Department['id']]: number
  }; let node; const roots = []; let
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i;
    list[i].children = [];
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== null) {
      if (!list[map[node.parentId]]) {
        list[map[node.parentId]].children = [];
      }
      list[map[node.parentId]].children?.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

const actions: ActionTree<DepartmentsStateInterface, StateInterface> = {
  async fetchDepartments(context, payload: FetchDepartmentsPayload) {
    const response = await api.get<FetchDepartmentsResponse>(
      '/departments',
      {
        params: payload,
      },
    );

    return {
      status: response.status === 200,
      response: {
        departments: payload.tree ? listToTree(
          response.data.departments.map((department) => ({
            ...department,
            parentId: (department.parentId === payload.parentId ? null : department.parentId),
          })),
        ) : response.data.departments,
      },
    };
  },
  async fetchDepartment(context, payload: FetchDepartmentPayload) {
    const response = await api.get<FetchDepartmentResponse>(
      `/departments/${payload.id}`,
    );

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async fetchDepartmentPersons(context, payload: FetchDepartmentPersonsPayload) {
    const response = await api.get<FetchDepartmentPersonsResponse>(
      `/departments/${payload.id}/persons`,
    );

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async fetchDepartmentPerson(context, payload: FetchDepartmentPersonPayload) {
    const response = await api.get<FetchDepartmentPersonResponse>(
      `/departments/${payload.id}/persons/${payload.personId}`,
    );

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async updateDepartment({ commit }, payload: UpdateDepartmentPayload) {
    const response = await api.patch<
      UpdateDepartmentSuccessResponse | UpdateDepartmentFailureResponse
    >(
      `/departments/${payload.id}/`,
      (({ name, parentId }) => ({ name, parentId }))(payload.model),
    );

    if (response.status === 200) {
      commit('signal', { type: SignalType.departmentUpdated }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async createDepartment({ commit }, payload: CreateDepartmentPayload) {
    const response = await api.post<
      CreateDepartmentSuccessResponse | CreateDepartmentFailureResponse
    >(
      '/departments/',
      (({ name, parentId }) => ({ name, parentId }))(payload),
    );

    if (response.status === 200) {
      commit('signal', { type: SignalType.departmentCreated }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async removeDepartment({ commit }, payload: RemoveDepartmentPayload) {
    const response = await api.delete<
      RemoveDepartmentSuccessResponse | RemoveDepartmentFailureResponse
    >(
      `/departments/${payload.id}`,
    );

    if (response.status === 200) {
      commit('signal', { type: SignalType.departmentRemoved, payload }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
};

export default actions;
