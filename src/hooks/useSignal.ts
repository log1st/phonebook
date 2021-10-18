import { useStore } from 'src/store';
import { arrayFrom } from 'src/utils/object';

export enum SignalType {
  departmentCreated = 'departmentCreated',
  departmentUpdated = 'departmentUpdated',
  departmentRemoved = 'departmentRemoved',
  personUpdated = 'personUpdated',
  personCreated = 'personCreated',
  personRemoved = 'personRemoved',
  personsOrderUpdated = 'personsOrderUpdated',
}

export interface Signal {
  type: SignalType;
  payload: any;
}

export const useSignal = () => {
  const store = useStore();

  const subscribeToSignal = (signal: SignalType | Array<SignalType>, callback: (payload: Signal['payload']) => void) => store.subscribe(({ type, payload }) => {
    if (type !== 'signal') {
      return;
    }
    if (!arrayFrom(signal).includes(payload.type)) {
      return;
    }
    callback(payload.payload);
  });

  return {
    subscribeToSignal,
  };
};
