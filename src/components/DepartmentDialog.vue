<template>
  <q-dialog
    ref="dialogRef"
    :class="$style.dialog"
    @hide="onDialogHide">
    <q-card
      tag="form"
      @submit.prevent="submit"
      class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">{{ id ? 'Редактирование' : 'Создание' }} департамента</div>
        <q-input
          autofocus
          v-model="model.name"
          :error="'name' in errorsMap"
          :error-message="errorsMap.name?.join(`\n`)"
          label="Название"/>
        <q-select
          :error="'parentId' in errorsMap"
          :error-message="errorsMap.parentId?.join(`\n`)"
          v-model="model.parentId"
          :options="departments.filter(d => (d.id !== id))"
          option-value="id"
          option-label="name"
          label="Родитель"
          clearable
          map-options
          emit-value
          :disable="!id"
          autocomplete/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          flat
          label="Отмена"
          @click="onCancelClick" />
        <q-btn
          type="submit"
          :label="id ? 'Сохранить' : 'Создать'"
          color="primary"
          :loading="isLoading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, PropType, ref, toRefs, watch,
} from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { DepartmentModel, useDepartments } from 'src/hooks/useDepartments';
import { Department } from 'src/models/Department';
import { useErrors } from 'src/hooks/useErrors';

export default defineComponent({
  name: 'DepartmentDialog',
  props: {
    id: Number as PropType<number>,
    parentId: Number as PropType<number>,
  },

  emits: [
    ...useDialogPluginComponent.emits,
  ],

  setup(props) {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent();

    const getEmptyModel = () => ({
      name: '',
      order: 0,
      parentId: props.parentId || null,
    });

    const model = ref<DepartmentModel>(getEmptyModel());
    const isLoading = ref(false);

    const {
      fetchDepartment,
      fetchDepartments,
      createDepartment,
      updateDepartment,
    } = useDepartments();

    const departments = ref<Array<Department>>([]);

    onMounted(async () => {
      const { status, response } = await fetchDepartments({ tree: false });

      if (status) {
        departments.value = response.departments;
      }
    });

    const { id } = toRefs(props);
    watch(id, async (newId) => {
      model.value = getEmptyModel();
      if (!newId) {
        return;
      }
      isLoading.value = true;
      const { status, response } = await fetchDepartment({ id: newId });

      if (status) {
        model.value = (({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          id, children, ...rest
        }) => (rest))(response);
      }
      isLoading.value = false;
    }, {
      immediate: true,
    });

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<keyof DepartmentModel>();

    const submit = async () => {
      clearErrors();
      isLoading.value = true;

      const { status, response } = await (props.id ? updateDepartment({
        id: props.id,
        model: model.value,
      }) : createDepartment(model.value));
      isLoading.value = false;

      if (!status) {
        setErrors(response);
      } else {
        onDialogOK();
      }
    };

    return {
      dialogRef,
      onDialogHide,

      onOKClick: submit,

      onCancelClick: onDialogCancel,

      errorsMap,
      model,
      submit,
      departments,
      isLoading,
    };
  },
});
</script>

<style lang="scss" module>
// @TODO что-то не так с апи модалок, нет pointer-events из-за класса, который безусловно ставится
.dialog {
  &:global(.no-pointer-events),
  :global(.no-pointer-events) {
    pointer-events: auto !important;
  }
}
</style>
