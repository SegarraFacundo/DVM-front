import { create } from 'zustand'

interface UseBomba {
  encendidoApagado: 'encender' | 'apagar'
  setEncendidoApagado: (encendidoApagado: 'encender' | 'apagar') => void
}

export const useBomba = create<UseBomba>((set) => ({
  encendidoApagado: 'encender',
  setEncendidoApagado: (encendidoApagado: 'encender' | 'apagar'): void => set({ encendidoApagado })
}))
