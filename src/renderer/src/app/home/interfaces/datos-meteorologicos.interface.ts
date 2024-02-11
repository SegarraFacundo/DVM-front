export interface DatosMeteorologicos {
  command: 'datosMeteorologicos'
  humedad: number | null
  velViento: number | null
  dirViento: number | null
  temperatura: number | null
  puntoDeRocio: number | null
}
