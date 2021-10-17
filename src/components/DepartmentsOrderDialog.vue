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
        <div class="text-h6">Сортировка департаментов</div>
        <draggable
          class="q-list q-list--bordered q-list--separator q-mt-md"
          v-model="departments"
          item-key="id"
        >
          <template #item="{element, index}">
            <q-item :style="{cursor: 'move'}">
              <q-item-section avatar>
                <q-avatar
                  size="sm"
                  color="primary"
                  text-color="white">
                  {{index + 1}}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{element.name}}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </draggable>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          flat
          label="Отмена"
          @click="onCancelClick" />
        <q-btn
          type="submit"
          label="Сохранить"
          color="primary"
          :loading="isLoading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, PropType, ref,
} from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useDepartments } from 'src/hooks/useDepartments';
import { Department } from 'src/models/Department';
import { useErrors } from 'src/hooks/useErrors';
import Draggable from 'vuedraggable';

export default defineComponent({
  name: 'DepartmentDialog',
  components: {
    Draggable,
  },
  props: {
    id: Number as PropType<number>,
  },

  emits: [
    ...useDialogPluginComponent.emits,
  ],

  setup(props) {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent();

    const isLoading = ref(false);

    const {
      fetchDepartments,
      updateDepartmentsOrder,
    } = useDepartments();

    const departments = ref<Array<Department>>([]);

    onMounted(async () => {
      const { status, response } = await fetchDepartments({ tree: true, parentId: props.id });

      if (status) {
        departments.value = response.departments;
      }
    });

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<'order'>();

    const submit = async () => {
      clearErrors();

      const { status, response } = await updateDepartmentsOrder({
        id: props.id || null,
        order: departments.value.map(({ id }) => id),
      });

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
