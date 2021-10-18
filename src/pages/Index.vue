<template>
  <q-page
    padding
    class="row">
    <div class="col-3 row column relative-position">
      <div class="row items-center q-pr-md">
        <q-btn
          fab-mini
          icon="skip_previous"
          v-if="department && !personId"
          @click="$router.push(`/${department.parentId || ''}`)"
          class="q-mr-sm"/>
        <q-btn
          size="lg"
          no-caps
          flat
          align="left"
          :disable="!personId"
          :class="[
            'text-h5',
            'self-start',
            !personId && 'no-pointer-events',
          ]"
          :to="{name: 'index', params: {id: department?.id}}"
        >{{department?.name || 'Справочник'}}</q-btn>
        <q-btn
          color="orange"
          round
          class="q-ml-auto"
          icon="edit"
          v-if="department && isEditing"
          @click="showDepartmentDialog(department)"/>
        <q-btn
          color="red"
          round
          class="q-ml-md"
          icon="remove"
          v-if="department && isEditing"
          @click="showDepartmentRemovalDialog(department)"/>
      </div>
      <q-scroll-area class="col-grow q-mt-md">
        <q-inner-loading
          v-if="isFetchingDepartments"
          showing>
          <q-spinner-gears
            size="50px"
            color="primary" />
        </q-inner-loading>
        <q-tree
          :key="isFetchingDepartments ? 1 : 0"
          :nodes="departments"
          node-key="id"
          :no-nodes-label="isFetchingDepartments ? 'Загрузка...' : 'Нет ни одного департамента'"
          default-expand-all
          v-model:selected="selected">
          <template #default-header="{node}">
            {{node.name}}
          </template>
        </q-tree>
      </q-scroll-area>
      <q-btn
        v-if="isEditing && department"
        fab
        color="green"
        icon="add"
        class="absolute"
        :style="{right: '10px', bottom: '10px'}"
        @click="showDepartmentDialog({parentId: department?.id})"/>
      <q-btn
        fab-mini
        color="orange"
        icon="sort"
        v-if="isEditing && departments.length > 1"
        class="absolute"
        :style="{left: '10px', bottom: '10px'}"
        @click="showDepartmentsSortDialog(department?.id || null)"/>
    </div>
    <div
      class="col-9 row">
      <q-separator
        class="q-mr-md"
        vertical
        key="separator"
        inset/>
      <q-banner
        v-if="!id"
        key="no-wrapper"
        class="text-h4 col-grow text-center text-blue-10"
      >Выберите департамент из списка</q-banner>
      <div
        key="person-wrapper"
        class="q-banner row col-grow relative-position"
        v-else-if="personId">
        <q-inner-loading
          v-if="isFetchingPerson"
          showing
          key="fetching-person-gear">
          <q-spinner-gears
            size="50px"
            color="primary" />
        </q-inner-loading>
        <div
          v-else
          key="person-data"
          class="row column">
          <div class="text-h3">{{[
            person?.firstName,
            person?.middleName,
            person?.lastName
          ].filter(Boolean).join(' ')}}</div>
          <div class="text-h4 text-grey">{{person?.position}}</div>
          <div class="row q-mt-md">
            <q-avatar
              square
              :style="{borderRadius: '10px'}"
              size="300px">
              <q-img
                :src="person?.photoUrl"/>
            </q-avatar>
            <div class="row column q-ml-md">
              <template v-if="person?.contacts.length">
                <div class="text-h5">Контакты</div>
                <q-list
                  separator
                  bordered
                  class="q-mt-md q-mb-md">
                  <q-item
                    clickable
                    @click="goToContact(contact)"
                    v-for="contact in person?.contacts"
                    :key="contact.id">
                    <q-item-section avatar>
                      <q-icon
                        :name="{
                          phone: 'call',
                          email: 'email',
                          address: 'location_on'
                        }[contact.type]"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{contact.value}}
                      </q-item-label>
                      <q-item-label
                        caption
                        v-if="contact.label">
                        {{contact.label}}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
              <div class="text-h5">Департаменты</div>
              <q-list
                class="q-mt-md separator"
                separator
                bordered
              >
                <q-item
                  :to="`/${d.id}/${person?.id}`"
                  v-for="d in person?.departments"
                  :key="d.id">
                  <q-item-section>
                    <q-item-label>
                      {{d.name}}
                    </q-item-label>
                    <q-item-label caption>
                      {{d.position}}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <q-btn
            v-if="isEditing"
            fab
            color="orange"
            icon="edit"
            class="absolute"
            :style="{right: '10px', bottom: '10px'}"
            @click="showPersonDialog(person?.id, department.id)"/>
          <q-btn
            v-if="isEditing"
            fab
            color="red"
            icon="remove"
            class="absolute"
            :style="{right: '10px', top: '10px'}"
            @click="showPersonRemovalDialog(person, department.id)"/>
        </div>
      </div>
      <div
        class="q-banner row col-grow relative-position"
        key="persons-wrap"
        v-else-if="id">
        <q-inner-loading
          v-if="isFetchingPersons"
          key="persons-loader"
          showing>
          <q-spinner-gears
            size="50px"
            color="primary" />
        </q-inner-loading>
        <q-scroll-area
          class="col-grow"
          key="persons-wrapper"
          :content-style="{display: 'flex', flexDirection: 'column'}"
          v-else>
          <q-banner
            v-if="!persons.length"
            key="no-wrapper"
            class="text-h4 col-grow text-center text-blue-10"
          >Нет ни одного контакта</q-banner>
          <Draggable
            class="q-list"
            v-else
            item-key="id"
            :handle="`.${$style.drag}`"
            @update:modelValue="setPersonsOrder"
            v-model="persons">
            <template #item="{element: person, index}">
              <q-item :to="`/${id}/${person.id}`">
                <q-item-section
                  avatar>
                  <div
                    class="row items-center">
                    <q-btn
                      icon="sort"
                      flat
                      size="sm"
                      round
                      v-if="isEditing && persons?.length > 1"
                      class="q-mr-md"
                      @click.prevent
                      :class="$style.drag"/>
                    <q-avatar color="primary">
                      <img
                        :src="person.photoUrl"/>
                    </q-avatar>
                  </div>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{[
                      person.firstName,
                      person.middleName,
                      person.lastName
                    ].filter(Boolean).join(' ')}}
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="1">{{person.position}}</q-item-label>
                </q-item-section>
                <q-item-section
                  side>
                  <div class="row items-center">
                    <q-item-label caption>№{{ index + 1 }}</q-item-label>
                    <q-btn
                      v-if="isEditing"
                      round
                      size="sm"
                      color="red"
                      icon="remove"
                      class="q-ml-md"
                      @click.prevent="showPersonRemovalDialog(person, department.id)"/>
                  </div>
                </q-item-section>
              </q-item>
            </template>
          </Draggable>
        </q-scroll-area>
        <q-btn
          v-if="isEditing"
          fab
          color="green"
          icon="add"
          class="absolute"
          :style="{right: '10px', bottom: '10px'}"
          @click="showPersonDialog(null, department.id)"/>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, PropType, ref, toRefs, watch,
} from 'vue';
import { useDepartments } from 'src/hooks/useDepartments';
import { Department } from 'src/models/Department';
import { useRouter } from 'src/router';
import { DepartmentPerson, Person } from 'src/models/Person';
import { Contact, ContactType } from 'src/models/Contact';
import { useEditing } from 'src/hooks/useEditing';
import { SignalType, useSignal } from 'src/hooks/useSignal';
import Draggable from 'vuedraggable';

export default defineComponent({
  name: 'PageIndex',
  props: {
    id: Number as PropType<number>,
    personId: Number as PropType<number>,
  },
  components: {
    Draggable,
  },
  setup(props) {
    const { id, personId } = toRefs(props);
    const department = ref<Department | null>(null);
    const isFetchingDepartment = ref(true);
    const person = ref<DepartmentPerson | null>(null);
    const isFetchingPerson = ref(true);
    const departments = ref<Array<Department>>([]);
    const isFetchingDepartments = ref(true);
    const persons = ref<Array<Person>>([]);
    const isFetchingPersons = ref(true);

    const {
      fetchDepartment,
      fetchDepartments,
      fetchDepartmentPersons,
      fetchDepartmentPerson,
      updatePersonsOrder,
    } = useDepartments();

    const loadDepartments = async () => {
      // departments.value = [];
      isFetchingDepartments.value = true;
      const { status, response } = await fetchDepartments({
        parentId: id.value || null,
      });

      isFetchingDepartments.value = false;

      if (status) {
        departments.value = response.departments;
      }
    };

    watch(id, () => {
      requestAnimationFrame(loadDepartments);
    }, {
      immediate: !process.env.SERVER,
    });

    const loadDepartment = async () => {
      if (!id.value) {
        department.value = null;
        return;
      }
      isFetchingDepartment.value = true;
      const { status, response } = await fetchDepartment({
        id: id.value,
      });

      isFetchingDepartment.value = false;

      if (status) {
        department.value = response;
      }
    };

    watch(id, () => {
      requestAnimationFrame(loadDepartment);
    }, {
      immediate: !process.env.SERVER,
    });

    const {
      subscribeToSignal,
    } = useSignal();

    onBeforeUnmount(
      subscribeToSignal([
        SignalType.departmentCreated,
        SignalType.departmentUpdated,
      ], () => {
        requestAnimationFrame(loadDepartments);
        requestAnimationFrame(loadDepartment);
      }),
    );

    const router = useRouter();

    onBeforeUnmount(
      subscribeToSignal(
        SignalType.departmentRemoved,
        async ({ parentId }: Department) => {
          await router.push({ params: { id: parentId || '' } });
        },
      ),
    );

    const loadPersons = async () => {
      if (!id.value) {
        persons.value = [];
        return;
      }
      isFetchingPersons.value = true;
      const { status, response } = await fetchDepartmentPersons({
        id: id.value,
      });

      isFetchingPersons.value = false;

      if (status) {
        persons.value = response.persons;
      }
    };

    watch(id, () => {
      requestAnimationFrame(loadPersons);
    }, {
      immediate: !process.env.SERVER,
    });

    onBeforeUnmount(
      subscribeToSignal([
        SignalType.personRemoved,
        SignalType.personCreated,
        SignalType.personUpdated,
        SignalType.personsOrderUpdated,
      ], loadPersons),
    );

    const loadPerson = async () => {
      if (!personId.value || !id.value) {
        person.value = null;
        return;
      }
      isFetchingPerson.value = true;
      const { status, response } = await fetchDepartmentPerson({
        id: id.value,
        personId: personId.value,
      });

      isFetchingPerson.value = false;

      if (status) {
        person.value = response;
      }
    };

    watch(computed(() => ({
      personId: personId.value,
      id: id.value,
    })), () => {
      requestAnimationFrame(loadPerson);
    }, {
      immediate: !process.env.SERVER,
      deep: true,
    });

    onBeforeUnmount(
      subscribeToSignal([
        SignalType.personCreated,
        SignalType.personUpdated,
      ], loadPerson),
    );

    onBeforeUnmount(
      subscribeToSignal(
        SignalType.personRemoved,
        async () => {
          if (personId.value && id.value) {
            await router.push(`/${id.value}`);
          }
        },
      ),
    );

    const selected = ref(null);

    watch(selected, async (id) => {
      if (!id) {
        return;
      }
      await router.push({
        name: 'index',
        params: {
          id,
        },
      });
      selected.value = null;
    });

    const goToContact = (contact: Contact) => {
      if (contact.type === ContactType.address) {
        window.open(`https://www.google.com/maps/search/test/${contact.value}`, '_blank');
      } else if (contact.type === ContactType.email) {
        window.open(`mailto:${contact.value}`);
      } else if (contact.type === ContactType.phone) {
        window.open(`tel:+${contact.value}`);
      }
    };

    const {
      isEditing,
      showDepartmentDialog,
      showDepartmentsSortDialog,
      showDepartmentRemovalDialog,
      showPersonDialog,
      showPersonRemovalDialog,
    } = useEditing();

    const setPersonsOrder = async () => {
      if (!id.value) {
        return;
      }
      await updatePersonsOrder({
        id: id.value,
        order: persons.value.map(((p) => p.id)),
      });
    };

    return {
      department,
      departments,
      isFetchingDepartments,
      isFetchingPersons,
      isFetchingPerson,
      isFetchingDepartment,
      selected,
      persons,
      person,
      goToContact,
      isEditing,
      showDepartmentDialog,
      showDepartmentsSortDialog,
      showDepartmentRemovalDialog,
      showPersonDialog,
      showPersonRemovalDialog,
      setPersonsOrder,
    };
  },
});
</script>

<style lang="scss" module>
.drag {
  cursor: move;
}
</style>
