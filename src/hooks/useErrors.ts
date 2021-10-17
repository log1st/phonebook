import {
  computed, ref,
} from 'vue';
import { arrayFrom } from 'src/utils/object';

export type SourcePureErrors<T extends string> = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof T]: string[] | string
}
export type SourceErrors<T extends string> = Array<[key: keyof T, errors: string[] | string]>

export type ErrorsMap<T extends string> = {
  // eslint-disable-next-line no-unused-vars
  [key in T]: string[];
}

export const useErrors = <T extends string>() => {
  const sourceErrors = ref<SourceErrors<T>>([]);
  const errorsMap = computed<ErrorsMap<T>>(() => (
    sourceErrors.value.reduce((acc, [key, errors]) => ({
      ...acc,
      [key]: arrayFrom(errors),
    }), {} as ErrorsMap<T>)
  ));

  const setErrors = (errors: SourceErrors<T> | SourcePureErrors<T>) => {
    // @TODO что-то не так с типизацией параметра из рефа
    sourceErrors.value.push(...errors instanceof Array ? errors : Object.entries(errors) as any);
  };

  const clearErrors = () => {
    sourceErrors.value = [];
  };

  return {
    errorsMap,
    setErrors,
    clearErrors,
  };
};
