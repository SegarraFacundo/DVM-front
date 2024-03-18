export type IdsEstadoAspersorType = -1 | 0 | 1 | 2 | 3 | 4 | 5
export type DescripcionEstadoAspersorType =
  | ''
  | 'OK'
  | '1Sobrecorriente en motor'
  | '2Sobrecorriente en motor'
  | '3Sobrecorriente en motor'
  | '4Sobrecorriente en motor'
  | '5Sobrecorriente en motor'
export interface AspersorData {
  id: 1 | 2 | 3 | 4
  deshabilitado?: boolean
  estado?: EstadoAspersor
  rpm?: number
  rpmDeseado?: number
}

interface EstadoAspersor {
  id: IdsEstadoAspersorType
  descripcion: DescripcionEstadoAspersorType
}

export type NodoType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'
export interface NodoData {
  id: number
  nombre: NodoType
  deshabilitado?: boolean
  aspersores: AspersorData[]
}
