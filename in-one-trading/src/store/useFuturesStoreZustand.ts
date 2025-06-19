import { create } from 'zustand';
import { combine } from 'zustand/middleware';

interface FututesState1 {
  age: number;
  increaseAge: () => void;
  decreaseAge: () => void;
  resetAge: () => void;
  name: string;
  setName: (name: string) => void;
}

export const useFuturesStoreZustand = create<FututesState1>()(
  combine(
    {
      age: 0,
      name: '',
    },
    (set) => ({
      increaseAge: () => set((state) => ({ age: state.age + 1 })),
      decreaseAge: () => set((state) => ({ age: state.age - 1 })),
      resetAge: () => set({ age: 0 }),
      setName: (name) => set({ name }),
    })
  )
);