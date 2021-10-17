export const arrayFrom = <T>(source: Array<T> | T) => (
  source instanceof Array ? source : [source]
);
