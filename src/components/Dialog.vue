<template>
  <q-dialog
    :class="$style.dialog"
    ref="dialogRef"
    @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Редактирование департамента</div>
        {{id}} {{parentId}}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="OK"
          @click="onOKClick" />
        <q-btn
          color="primary"
          label="Cancel"
          @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useDialogPluginComponent } from 'quasar';

export default defineComponent({
  name: 'DepartmentDialog',
  props: {
    id: Number as PropType<number>,
    parentId: Number as PropType<number>,
  },

  emits: [
    ...useDialogPluginComponent.emits,
  ],

  setup() {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,

      onOKClick() {
        onDialogOK();
      },

      onCancelClick: onDialogCancel,
    };
  },
});
</script>
