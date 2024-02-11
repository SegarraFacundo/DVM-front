import { create } from 'zustand'

interface Operario {
  id: number
  name: string
}

interface TipoAplicacion {
  id: number
  name: string
}

interface UseFormInitial {
  isValid: boolean
  operario: Operario
  lote: string
  tipoAplicacion: TipoAplicacion
  setFormInitial: (newState: {
    isValid: boolean,
    operario: Operario,
    lote: string,
    tipoAplicacion: TipoAplicacion
  }) => void
}

export const useFormInitial = create<UseFormInitial>((set) => ({
  isValid: false,
  operario: {
    id: -1,
    name: ''
  },
  lote: '',
  tipoAplicacion: {
    id: -1,
    name: ''
  },
  setFormInitial: (newState: {
    isValid: boolean,
    operario: Operario,
    lote: string,
    tipoAplicacion: TipoAplicacion
  }) => set({ isValid: newState.isValid, operario: newState.operario, lote: newState.lote, tipoAplicacion: newState.tipoAplicacion })
}))
