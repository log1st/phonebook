import { Ref, ref } from 'vue';

export const useToggle = <T extends any = boolean>(
  initalValue: T = false as T,
  trueValue: T = true as T,
  falseValue: T = false as T,
): [
  Ref<T & any>,
  () => void,
  // eslint-disable-next-line no-unused-vars
  (value: T) => void,
] => {
  const value = ref<T>(initalValue);

  const toggle = () => {
    value.value = (value.value === trueValue ? falseValue : trueValue) as typeof value.value;
  };

  const set = (val: T) => {
    value.value = val as typeof value.value;
  };

  return [value, toggle, set];
};
