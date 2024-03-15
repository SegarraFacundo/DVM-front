import { DatosMeteorologicos } from "@renderer/app/home/interfaces/datos-meteorologicos.interface"
import { NodoData } from "@renderer/ui/components/nodo/interfaces/nodo-data"

export interface ClientToServerEvents {
  testing: () => Promise<boolean>
  startJob: (rpm: number) => void
  stopJob: () => void
}

export interface ServerToClientEvents {
  getStateNodo: (data: NodoData[]) => void
  getDatosMeteorologicos: (data: DatosMeteorologicos) => void
}
