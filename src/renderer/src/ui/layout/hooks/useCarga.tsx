import { create } from 'zustand'

type Carga = {
  cargando: boolean;
  setCargando: (value: boolean) => void;
};

export const useCarga = create<Carga>((set) => ({
  cargando: false,
  setCargando: (value: boolean) => set(() => ({ cargando: value }))
}))
