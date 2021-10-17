<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn
            :to="{name: 'index'}"
            flat
            no-caps
            no-wrap>
            Телефонная книжка
          </q-btn>
        </q-toolbar-title>
        <template v-if="isAuthorized">
          <q-btn
            no-caps
            flat
            class="no-pointer-events">
            Привет, {{userData.login}}
          </q-btn>
          <q-checkbox
            v-if="can(['admin', 'root'])"
            v-model="isEditing"
            color="red"
            dark
            class="q-mr-md"
            label="Режим редактирования"/>
          <q-btn
            color="red"
            @click="signOut"
            :loading="isSigningOut">Выйти</q-btn>
        </template>
        <template v-else>
          <q-btn
            flat
            @click="toggleSignInDialog">Войти</q-btn>
        </template>
      </q-toolbar>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <SignInDialog v-model="isSignInDialogVisible"/>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useAuth } from 'src/hooks/useAuth';
import SignInDialog from 'components/SignInDialog.vue';
import { useToggle } from 'src/hooks/useToggle';
import { useEditing } from 'src/hooks/useEditing';

export default defineComponent({
  name: 'MainLayout',
  components: { SignInDialog },
  setup() {
    const {
      isAuthorized,
      userData,
      signOut,
      isSigningOut,
      can,
    } = useAuth();

    const [isSignInDialogVisible, toggleSignInDialog, setSignInDialogVisibility] = useToggle();

    watch(isAuthorized, (value) => {
      if (!value) {
        return;
      }
      setSignInDialogVisibility(false);
    }, {
      immediate: true,
    });

    watch(isSignInDialogVisible, (value) => {
      if (!value) {
        return;
      }
      if (!isAuthorized.value) {
        return;
      }
      setSignInDialogVisibility(false);
    }, {
      immediate: true,
    });

    const {
      isEditing,
    } = useEditing();

    return {
      userData,
      isAuthorized,
      isSignInDialogVisible,
      toggleSignInDialog,
      signOut,
      isSigningOut,
      isEditing,
      can,
    };
  },
});
</script>
