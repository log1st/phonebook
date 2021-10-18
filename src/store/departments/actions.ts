import { ActionTree } from 'vuex';
import {
  CreateDepartmentFailureResponse,
  CreateDepartmentPayload,
  CreateDepartmentSuccessResponse,
  CreatePersonFailureResponse,
  CreatePersonPayload,
  CreatePersonSuccessResponse,
  FetchDepartmentPayload,
  FetchDepartmentPersonPayload,
  FetchDepartmentPersonResponse,
  FetchDepartmentPersonsPayload,
  FetchDepartmentPersonsResponse,
  FetchDepartmentResponse,
  FetchDepartmentsPayload,
  FetchDepartmentsResponse,
  RemoveDepartmentFailureResponse,
  RemoveDepartmentPayload,
  RemoveDepartmentSuccessResponse,
  RemovePersonFailureResponse,
  RemovePersonPayload,
  RemovePersonSuccessResponse,
  UpdateDepartmentFailureResponse,
  UpdateDepartmentPayload,
  UpdateDepartmentsOrderFailureResponse,
  UpdateDepartmentsOrderPayload,
  UpdateDepartmentsOrderSuccessResponse,
  UpdateDepartmentSuccessResponse,
  UpdatePersonFailureResponse,
  UpdatePersonPayload, UpdatePersonsOrderPayload,
  UpdatePersonSuccessResponse,
} from 'src/hooks/useDepartments';
import { api } from 'boot/axios';
import { SignalType } from 'src/hooks/useSignal';
import { serialize } from 'object-to-formdata';
import { StateInterface } from '../index';
import { DepartmentsStateInterface } from './state';

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
      response: response.data,
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
      commit('signal', { type: SignalType.departmentRemoved }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async updateDepartmentsOrder({ commit }, payload: UpdateDepartmentsOrderPayload) {
    const response = await api.patch<
      UpdateDepartmentsOrderSuccessResponse | UpdateDepartmentsOrderFailureResponse
    >(
      '/departments/order',
      {
        order: payload.order,
      }, {
        params: {
          id: payload.id || undefined,
        },
      },
    );

    if (response.status === 200) {
      commit('signal', { type: SignalType.departmentUpdated, payload }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async updatePerson({ commit }, payload: UpdatePersonPayload) {
    const response = await api.patch<
      UpdatePersonSuccessResponse | UpdatePersonFailureResponse
    >(
      `/persons/${payload.id}`,
      serialize(payload.model, {
        indices: true,
      }),
    );

    if (response.status === 200) {
      commit('signal', { type: SignalType.personUpdated, payload }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async createPerson({ commit }, payload: CreatePersonPayload) {
    const response = await api.post<
      CreatePersonSuccessResponse | CreatePersonFailureResponse
    >(
      '/persons/',
      serialize(payload, {
        indices: true,
      }),
    );

    if (response.status === 200) {
      commit('signal', { type: SignalType.personCreated, payload }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async removePerson({ commit }, payload: RemovePersonPayload) {
    const response = await api.delete<
      RemovePersonSuccessResponse | RemovePersonFailureResponse
    >(
      `/departments/${payload.departmentId}/persons/${payload.id}`,
    );

    if (response.status === 200) {
      commit('signal', { type: SignalType.personRemoved }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
  async updatePersonsOrder({ commit }, payload: UpdatePersonsOrderPayload) {
    const response = await api.patch<
      RemovePersonSuccessResponse | RemovePersonFailureResponse
    >(
      `/departments/${payload.id}/order`,
      {
        order: payload.order,
      },
    );

    if (response.status === 200) {
      commit('signal', { type: SignalType.personsOrderUpdated }, { root: true });
    }

    return {
      status: response.status === 200,
      response: response.data,
    };
  },
};

export default actions;
