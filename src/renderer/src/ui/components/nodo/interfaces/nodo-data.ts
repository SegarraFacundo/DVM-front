export type EstadoAspersorType = -1 | 0 | 1 | 2 | 3 | 4
export interface AspersorData {
  id:  1 | 2 | 3 | 4
  deshabilitado?: boolean
  estado?: EstadoAspersorType
  rpm?: number
  rpmDeseado?: number
}

export type NodoType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'
export interface NodoData {
  id: number
  nombre: NodoType
  deshabilitado?: boolean
  aspersores: AspersorData[]
}