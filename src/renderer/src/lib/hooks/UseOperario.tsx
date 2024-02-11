import { create } from 'zustand'

interface UseOperario {
  operario: {
    name: string,
    id: number
  }
  setOperario: (newOperario: {
    name: string,
    id: number
  }) => void
}

export const useOperario = create<UseOperario>((set) => ({
  operario: {
    name: '',
    id: -1
  },
  setOperario: (newOperario: {
    name: string,
    id: number
  }) => set({ operario: newOperario })
}))
