import { create } from 'zustand'

interface UseMenu {
  habilitar: boolean
  setHabilitar: (habilitar: boolean) => void
}

export const useMenu = create<UseMenu>((set) => ({
  habilitar: true,
  setHabilitar: (habilitar: boolean): void => set({ habilitar })
}))
