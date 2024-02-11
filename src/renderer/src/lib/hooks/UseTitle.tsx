import { create } from 'zustand'

interface UseTitle {
  title: string
  setTitle: (newTitle: string) => void
}

export const useTitle = create<UseTitle>((set) => ({
  title: 'Inicio Aplicación',
  setTitle: (newTitle: string) => set({ title: newTitle })
}))
