import { DatosMeteorologicos } from "@renderer/app/home/interfaces/datos-meteorologicos.interface"
import { NodoData } from "@renderer/ui/components/nodo/interfaces/nodo-data"

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
}

export interface ServerToClientEvents {
  getStateNodo: (data: NodoData[]) => void
  getDatosMeteorologicos: (data: DatosMeteorologicos) => void
  desconectado: () => void
  error: (err: any) => void
}
