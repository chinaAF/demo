'use client';

import { signal, computed } from '@preact/signals-react';

let store: ReturnType<typeof createStore> | undefined;

function createStore() {
  const age = signal(0);
  const name = signal('');
  const doubleCount = computed(() => age.value * 2);

  return {
    age,
    name,
    doubleCount,
    increaseAge: () => age.value++,
    decreaseAge: () => age.value--,
    resetAge: () => age.value = 0,
    setName: (newName: string) => name.value = newName
  };
}

export function useSignalStore() {
  if (typeof window === 'undefined') {
    return createStore();
  }

  if (!store) {
    store = createStore();
  }

  return store;
}