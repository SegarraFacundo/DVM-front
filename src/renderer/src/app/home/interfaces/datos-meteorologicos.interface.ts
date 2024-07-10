export interface GPSData {
  nroSatelites: number | null
  velocicidad: number | null
  latitud: number | null
  longitud: number | null
  altura: number | null
}

export interface CaudalBoards {
  board_id: number | null
  caudalEngine0: number | null
  caudalEngine1: number | null
  caudalEngine2: number | null
  caudalEngine3: number | null
}

export interface CaudalData {
  boards: CaudalBoards[]
}

export interface DatosMeteorologicos {
  humedad: number | null
  velViento: number | null
  dirViento: number | null
  temperatura: number | null
  puntoDeRocio: number | null
  presionAtmosferica: number | null
  version: number | null
  gpsInfo?: GPSData
  caudalInfo?: CaudalData
}
