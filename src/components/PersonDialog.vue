<template>
  <q-dialog
    ref="dialogRef"
    :class="$style.dialog"
    @hide="onDialogHide">
    <q-card
      :style="{minWidth: '600px'}"
      tag="form"
      @submit.prevent="submit"
      class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">{{ personId ? 'Редактирование' : 'Создание' }} контакта</div>
        <q-input
          autofocus
          v-model="model.person.firstName"
          :error="'firstName' in errorsMap"
          :error-message="errorsMap.firstName?.join(`\n`)"
          :disable="isLoading"
          label="Имя"/>
        <q-input
          autofocus
          v-model="model.person.middleName"
          :error="'middleName' in errorsMap"
          :error-message="errorsMap.middleName?.join(`\n`)"
          :disable="isLoading"
          label="Отчество"/>
        <q-input
          autofocus
          v-model="model.person.lastName"
          :error="'lastName' in errorsMap"
          :error-message="errorsMap.lastName?.join(`\n`)"
          :disable="isLoading"
          label="Фамилия"/>
        <q-file
          autofocus
          v-model="model.person.photoUrl"
          :error="'photoUrl' in errorsMap"
          :error-message="errorsMap.photoUrl?.join(`\n`)"
          :disable="isLoading"
          label="Фотография">
          <template
            v-slot:before
            v-if="photoUrl">
            <q-avatar>
              <img :src="photoUrl">
            </q-avatar>
          </template>
        </q-file>
        <q-select
          v-model="model.departments"
          :options="departments"
          use-chips
          option-value="id"
          option-label="name"
          label="Департаменты"
          map-options
          emit-value
          autocomplete
          multiple
          :disable="isLoading || !personId"/>
        <q-input
          v-model="model.positions[department]"
          v-for="department in model.departments"
          :key="department"
          :disable="isLoading"
          :label="`Должность: ${departmentsMap[department]?.name}`"/>
        <div class="text-h6 q-mt-md">Контакты:</div>
        <Draggable
          v-model="model.contacts"
          item-key="id"
          :handle="`.${$style.drag}`">
          <template #item="{element: contact, index}">
            <div
              class="row q-col-gutter q-mt-sm items-center">
              <div class="col col-auto">
                <q-btn
                  icon="sort"
                  flat
                  size="sm"
                  round
                  :class="$style.drag"/>
              </div>
              <div class="col col-2 q-pl-sm">
                <q-select
                  :options="[
                    {label: 'Email', value: 'email'},
                    {label: 'Телефон',value: 'phone'},
                    {label: 'Адрес', value: 'address'}
                  ]"
                  label="Тип"
                  emit-value
                  map-options
                  :disable="isLoading"
                  v-model="contact.type"/>
              </div>
              <div class="col col-grow q-pl-sm">
                <q-input
                  v-model="contact.value"
                  label="Значение"
                  :disable="isLoading"/>
              </div>
              <div class="col col-grow q-pl-sm">
                <q-input
                  v-model="contact.label"
                  label="Описание"
                  :disable="isLoading"/>
              </div>
              <div class="col col-auto q-pl-sm">
                <q-btn
                  color="red"
                  icon="remove"
                  size="sm"
                  round
                  @click="removeContact(index)"/>
              </div>
            </div>
          </template>
        </Draggable>
        <div class="q-mt-md">
          <q-btn
            class="full-width"
            color="green"
            @click="addContact"
            label="Добавить контакт"
            :disable="isLoading"/>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          flat
          label="Отмена"
          @click="onCancelClick" />
        <q-btn
          type="submit"
          :label="personId ? 'Сохранить' : 'Создать'"
          color="primary"
          :loading="isLoading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, PropType, ref, toRefs, watch,
} from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { PersonModel, useDepartments } from 'src/hooks/useDepartments';
import { Department } from 'src/models/Department';
import { useErrors } from 'src/hooks/useErrors';
import { ContactType } from 'src/models/Contact';
import Draggable from 'vuedraggable';

export default defineComponent({
  name: 'PersonDialog',
  props: {
    personId: Number as PropType<number>,
    departmentId: Number as PropType<number>,
  },
  components: {
    Draggable,
  },

  emits: [
    ...useDialogPluginComponent.emits,
  ],

  setup(props) {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent();

    const getEmptyModel = (): PersonModel => ({
      person: {
        firstName: '',
        lastName: '',
        middleName: '',
        photoUrl: null,
      },
      positions: {},
      departments: [props.departmentId].filter(Boolean) as Array<Department['id']>,
      contacts: [],
    });

    const model = ref<PersonModel>(getEmptyModel());
    const photoUrl = ref<string | null>(null);
    const isLoading = ref(false);

    watch(computed(() => model.value.person.photoUrl), (url) => {
      if (url instanceof File) {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
          if (!e.target?.result) {
            photoUrl.value = null;
          } else {
            photoUrl.value = URL.createObjectURL(new Blob([e.target.result]));
          }
        });
        reader.readAsArrayBuffer(url);
      } else if (typeof url === 'string') {
        photoUrl.value = url;
      } else {
        photoUrl.value = null;
      }
    }, {
      immediate: true,
    });

    const {
      fetchDepartmentPerson,
      fetchDepartments,
      updatePerson,
      createPerson,
    } = useDepartments();

    const departments = ref<Array<Department>>([]);

    onMounted(async () => {
      const { status, response } = await fetchDepartments({ tree: false });

      if (status) {
        departments.value = response.departments;
      }
    });

    const { personId, departmentId } = toRefs(props);
    watch(computed(() => ({
      personId: personId.value,
      departmentId: departmentId.value,
    })), async (newIds) => {
      model.value = getEmptyModel();
      if (!newIds.personId || !newIds.departmentId) {
        return;
      }
      isLoading.value = true;
      const { status, response } = await fetchDepartmentPerson({
        id: newIds.departmentId,
        personId: newIds.personId,
      });

      if (status) {
        model.value = (({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          id, order, position, departments, contacts, ...rest
        }) => ({
          person: rest,
          positions: departments.reduce((acc, cur) => ({
            ...acc,
            [cur.id]: cur.position,
          }), {}),
          departments: departments.map(({ id }) => id),
          contacts,
        }))(response);
      }
      isLoading.value = false;
    }, {
      immediate: true,
    });

    const {
      errorsMap,
      clearErrors,
      setErrors,
    } = useErrors<keyof PersonModel['person'] | keyof Omit<PersonModel, 'person'>>();

    // eslint-disable-next-line @typescript-eslint/require-await
    const submit = async () => {
      clearErrors();
      isLoading.value = true;

      const { status, response } = await (props.personId ? updatePerson({
        id: props.personId,
        model: model.value,
      }) : createPerson(model.value));
      isLoading.value = false;

      if (!status) {
        setErrors(response);
      } else {
        onDialogOK();
      }
    };

    const departmentsMap = computed(() => (
      departments.value.reduce((acc, cur) => ({
        ...acc,
        [cur.id]: cur,
      }), {})
    ));

    watch(computed(() => model.value.departments), (ids) => {
      model.value.positions = ids.reduce((acc, id) => ({
        ...acc,
        [id]: model.value.positions[id] || '',
      }), {});
    }, {
      immediate: true,
    });

    const addContact = () => {
      model.value.contacts.push({
        id: Math.random().toString(36).substr(2, 7),
        label: '',
        type: ContactType.phone,
        value: '',
      });
    };

    const removeContact = (index: number) => {
      model.value.contacts.splice(index, 1);
    };

    return {
      dialogRef,
      onDialogHide,

      onOKClick: submit,

      onCancelClick: onDialogCancel,

      departmentsMap,

      errorsMap,
      model,
      submit,
      departments,
      isLoading,
      photoUrl,
      addContact,
      removeContact,
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

.drag {
  cursor: move;
}
</style>
