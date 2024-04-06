export type IdsEstadoAspersorType = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type DescripcionEstadoAspersorType =
  | ''
  | 'OK'
  | 'Cortocircuito' // Grave
  | 'Motor bloqueado' // Grave
  | 'Motor no conectado'
  | 'Sobrecorriente'
  | 'Subcorriente'
  | 'Baja tension'
  | 'Error de sensor'
  | 'RPM no alcanzada'
  | 'Error de caudalimetro'
  
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
