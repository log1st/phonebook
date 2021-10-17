<template>
  <q-dialog
    :class="$style.dialog"
    ref="dialogRef"
    v-model="localValue">
    <q-card
      :style="{minWidth: '350px'}"
      tag="form"
      @submit.prevent="submit">
      <q-card-section>
        <div class="text-h6">Вход</div>
      </q-card-section>
      <q-card-section>
        <q-input
          ref="loginInputRef"
          :error-message="errorsMap.login?.join(`\n`)"
          :error="'login' in errorsMap"
          dense
          v-model="model.login"
          label="Логин"
          autofocus/>
        <q-input
          :error-message="errorsMap.password?.join(`\n`)"
          :error="'password' in errorsMap"
          dense
          v-model="model.password"
          label="Пароль"
          autofocus/>
        <q-checkbox
          v-if="false"
          label="Запомнить меня"
          v-model="model.rememberMe"/>
      </q-card-section>
      <q-card-actions
        align="right"
        class="text-primary">
        <q-btn
          flat
          label="Отмена"
          v-close-popup/>
        <q-btn
          color="primary"
          label="Войти"
          :loading="isSigningIn"
          type="submit"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { SignInPayload, useAuth } from 'src/hooks/useAuth';
import { useLocalValue } from 'src/hooks/useLocalValue';
import { useErrors } from 'src/hooks/useErrors';
import { QDialog, QInput } from 'quasar';

export default defineComponent({
  name: 'signInDialog',
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localValue = useLocalValue(props, 'modelValue', emit);

    const model = ref<SignInPayload>({
      login: '',
      password: '',
      rememberMe: false,
    });

    watch(localValue, (value) => {
      if (value) {
        return;
      }
      model.value.login = '';
      model.value.password = '';
      model.value.rememberMe = false;
    });

    const {
      setErrors,
      clearErrors,
      errorsMap,
    } = useErrors<keyof SignInPayload>();

    const {
      signIn,
      isSigningIn,
    } = useAuth();

    const dialogRef = ref<QDialog>();
    const loginInputRef = ref<QInput>();

    const submit = async () => {
      clearErrors();

      const { status, response } = await signIn(model.value);

      if (!status) {
        setErrors(response);
        model.value.password = '';
        dialogRef.value?.shake();
        loginInputRef.value?.focus();
      }
    };

    return {
      localValue,
      model,
      errorsMap,
      submit,
      dialogRef,
      isSigningIn,
      loginInputRef,
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
