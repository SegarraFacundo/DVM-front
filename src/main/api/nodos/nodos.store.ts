import { readFileSync } from 'fs'
import path from 'path'

export type EstadoAspersorType = -1 | 0 | 1 | 2 | 3 | 4
export interface Aspersor {
  id: 1 | 2 | 3 | 4
  estado: EstadoAspersorType
  deshabilitado?: boolean
}

export interface EstadoNodo {
  nodo: number
  state1: EstadoAspersorType
  state2: EstadoAspersorType
  state3: EstadoAspersorType
  state4: EstadoAspersorType
  voltaje: number
}

export type NodoType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'
export interface Nodo {
  id: number
  nombre: NodoType
  deshabilitado?: boolean
  aspersores: Aspersor[]
}

export const NodosStore = () => {
  const urlDataJson = path.join(__dirname, '../../resources/data/nodos.json')
  return {
    all: async (): Promise<Nodo[]> =>
      JSON.parse(await readFileSync(urlDataJson).toString()) as Nodo[]
  }
}
