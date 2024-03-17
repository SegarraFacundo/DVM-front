import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

export type EstadoAspersorType = -1 | 0 | 1 | 2 | 3 | 4 | 5
export interface Aspersor {
  id: 1 | 2 | 3 | 4
  estado: EstadoAspersorType
  deshabilitado?: boolean
  rpm?: number
  rpmDeseado?: number
}

export interface EstadoNodoJob extends EstadoNodoTesting {
  corr1: number
  corr2: number
  corr3: number
  corr4: number
  rpm1: number
  rpm2: number
  rpm3: number
  rpm4: number
}

export interface EstadoNodoTesting {
  command: string
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
      JSON.parse(await readFileSync(urlDataJson).toString()) as Nodo[],
    stopAllNodos: async (): Promise<Nodo[]> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Nodo[]

      data = data.map((n) => {
        n.aspersores = n.aspersores.map((a) => ({ ...a, rpm: 0 }))

        return n
      })

      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    },
    stopNodo: async (id: number): Promise<Nodo[]> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Nodo[]

      data = data.map((n) => {
        if (n.id === id) n.aspersores = n.aspersores.map((a) => ({ ...a, rpm: 0 }))
        return n
      })

      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    },
    startAllNodo: async (rpm: number): Promise<Nodo[]> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Nodo[]

      data = data.map((n) => {
        n.aspersores = n.aspersores.map((a) => ({ ...a, rpm: rpm }))
        return n
      })

      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    },
    startNodo: async (id: number, rpm: number): Promise<Nodo[]> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Nodo[]

      data = data.map((n) => {
        if (n.id === id) n.aspersores = n.aspersores.map((a) => ({ ...a, rpm: rpm }))
        return n
      })

      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    },
    startNodoPorAspersor: async (id: number, aspersorRPMs: {
      rpm1: number,
      rpm2: number,
      rpm3: number,
      rpm4: number
      }): Promise<Nodo[]> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Nodo[]

      data = data.map((n) => {
        if (n.id === id) {
          n.aspersores[0].rpm = aspersorRPMs.rpm1
          n.aspersores[1].rpm = aspersorRPMs.rpm2
          n.aspersores[2].rpm = aspersorRPMs.rpm3
          n.aspersores[3].rpm = aspersorRPMs.rpm4
        }
        return n
      })

      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    },
  }
}
