import { create } from 'zustand'

export type TipoGotaType = 'FINA' | 'MEDIA' | 'GRUESA' | 'CUSTOM'

type TipoGota = {
  tipoGotaseleccionada?: TipoGotaType
  setTipoGota: (value?: TipoGotaType) => void
}

export const useTipoGota = create<TipoGota>((set) => ({
  tipoGotaseleccionada: undefined,
  setTipoGota: (value?: TipoGotaType) => set(() => ({ tipoGotaseleccionada: value }))
}))
