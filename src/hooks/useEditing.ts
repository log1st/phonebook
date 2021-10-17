import { useStore } from 'src/store';
import { computed } from 'vue';
import { Department } from 'src/models/Department';
import { useQuasar } from 'quasar';
import DepartmentDialog from 'components/DepartmentDialog.vue';

export const useEditing = () => {
  const store = useStore();

  const isEditing = computed({
    get() {
      return store.getters.isEditing as boolean;
    },
    set(value: boolean) {
      store.commit('setIsEditing', value);
    },
  });

  const q = useQuasar();

  const showDepartmentDialog = (department: Department | Pick<Department, 'parentId'>) => {
    q.dialog({
      title: 'Редактирование департамента',
      component: DepartmentDialog,
      componentProps: department,
    });
  };

  const showDepartmentsSortDialog = (departmentId: Department['id'] | null) => {
    // eslint-disable-next-line no-console
    console.log(departmentId);
  };

  return {
    isEditing,
    showDepartmentDialog,
    showDepartmentsSortDialog,
  };
};
