import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

export type IdsEstadoAspersorType = -1 | 0 | 1 | 2 | 3 | 4 | 5
export type DescripcionEstadoAspersorType =
  | ''
  | 'OK'
  | '1Sobrecorriente en motor'
  | '2Sobrecorriente en motor'
  | '3Sobrecorriente en motor'
  | '4Sobrecorriente en motor'
  | '5Sobrecorriente en motor'
export interface Aspersor {
  id: 1 | 2 | 3 | 4
  estado: EstadoAspersor
  deshabilitado?: boolean
  rpm?: number
  rpmDeseado?: number
}

interface EstadoAspersor {
  id: IdsEstadoAspersorType
  descripcion: DescripcionEstadoAspersorType
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
  state1: IdsEstadoAspersorType
  state2: IdsEstadoAspersorType
  state3: IdsEstadoAspersorType
  state4: IdsEstadoAspersorType
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
    startNodoPorAspersor: async (
      id: number,
      aspersorRPMs: {
        rpm1: number
        rpm2: number
        rpm3: number
        rpm4: number
      }
    ): Promise<Nodo[]> => {
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
    cambiarHabilitacionNodo: async (id: number): Promise<Nodo[]> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Nodo[]

      data = data.map((n) => {
        if (n.id === id) {
          n.deshabilitado = !n.deshabilitado
          n.aspersores = n.aspersores.map((a) => ({ ...a, deshabilitado: n.deshabilitado }))
        }
        return n
      })

      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    },
    cambiarHabilitacionAspersor: async (idNodo: number, idAspersor: number, deshabilitado: boolean): Promise<Nodo[]> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Nodo[]
      data = data.map((n) => {
        if (n.id == idNodo)
          n = {
            ...n,
            aspersores: n.aspersores.map((a) => {
              if (a.id == idAspersor) a.deshabilitado = deshabilitado
              return a
            })
          }
        return n
      })
      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    }
  }
}
