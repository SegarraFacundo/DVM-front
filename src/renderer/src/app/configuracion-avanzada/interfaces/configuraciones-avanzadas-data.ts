export interface ConfiguracionesAvanzadasData {
  ancho: number
  gota: {
    fina: number
    media: number
    gruesa: number
    custom: number
  }
  variacionRPM: number
  corriente: {
    maximo: number
    minimo: number
    limite: number
  }
  sensorRPM: true
  electroValvula: true
  password: string
}

export interface SendConfiguracionesAvanzadasData {
  variacionRPM: number
  subcorriente: number
  sobrecorriente: number
  cortocicuito: number
  sensor: boolean
  electrovalvula: boolean
}
