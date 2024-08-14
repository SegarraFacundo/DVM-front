import { DatosMeteorologicos } from '@renderer/app/home/interfaces/datos-meteorologicos.interface'
import { NodoData } from '@renderer/ui/components/nodo/interfaces/nodo-data'

export interface ClientToServerEvents {
  testing: () => Promise<boolean>
  startJob: (rpmDeseado: number) => void
  stopJob: () => void
  setConfiguracion: (value: {
    variacionRPM: number
    subcorriente: number
    sobrecorriente: number
    cortocicuito: number
    sensor: boolean
    electrovalvula: boolean
  }) => void
  scan: () => void
  version: () => void
  renombrar: (idNodo: number, nuevoIdNodo: number) => void
}

export interface ServerToClientEvents {
  getStateNodo: (data: NodoData[]) => void
  getDatosMeteorologicos: (data: DatosMeteorologicos) => void
  conectado: () => void
  rtaScan: (data: number[]) => void
  rtaVersion: (data: { version: string; boardVersion: string }) => void
  desconectado: () => void
  error: (err: any) => void
}
