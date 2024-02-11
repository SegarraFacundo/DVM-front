export interface AspersorData {
  id: number,
  estado: 'normal' | 'warning' | 'error' | ''
}

export interface NodoData {
  nodo: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'
  aspersores: AspersorData[]
}
