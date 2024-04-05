export interface DataUnidad {
  id: 1 | 2
  tipo: 'velocidad' | 'temperatura'
  unidad: 'Km/h' | 'mi/h' | 'C' | 'F'
  estaSeleccionada: boolean
}