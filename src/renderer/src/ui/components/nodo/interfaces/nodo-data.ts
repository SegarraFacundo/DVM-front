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

  export type UbicacionAspersorType =
  | {
      id: 1
      name: 'Ruedas'
    }
  | {
      id: 2
      name: 'No conectado'
    }
  | {
      id: 3
      name: 'Izquierda'
    }
  | {
      id: 4
      name: 'Derecha'
    }
  | {
      id: 5
      name: 'Centro'
    }
  | {
      id: 6
      name: 'Sin asignar'
    }

export interface AspersorData {
  id: 1 | 2 | 3 | 4
  deshabilitado?: boolean
  estado?: EstadoAspersor
  ubicacion?: UbicacionAspersorType
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
