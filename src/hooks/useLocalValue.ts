import {
  computed, SetupContext, WritableComputedRef,
} from 'vue';

export const useLocalValue = <
  P extends any,
  K extends keyof P,
  E extends SetupContext<any>['emit'] | any,
>(
    props: P,
    key: K,
    emit: E,
  ): WritableComputedRef<P[K]> => computed({
    get() {
      return props[key];
    },
    set(val: P[K]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      emit('update:modelValue', val);
    },
  });
