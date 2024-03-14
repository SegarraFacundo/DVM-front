export interface ClientToServerEvents {
  testing: () => Promise<boolean>
}

export interface ServerToClientEvents {
  getStateNodo: (data: Nodo[]) => void
  getDatosMeteorologicos: (data: DatosMeteorologicos) => void
}
