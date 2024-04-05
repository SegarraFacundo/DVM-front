export interface ConfiguracionesAvanzadasData {
  ancho: number
  gota: {
    fina: number
    media: number
    gruesa: number
    custom: number
  }
  variacion: {
    min: number
    max: number
  }
  corriente: {
    maximo: number
    minimo: number
    limite: number
  }
  sensorRPM: true
  electroValvula: true
}