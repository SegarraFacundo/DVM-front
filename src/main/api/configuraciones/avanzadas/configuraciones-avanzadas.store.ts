import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

export interface ConfiguracionesAvanzadas {
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

export const ConfiguracionesAvanzadasStore = () => {
  const urlDataJson = path.join(__dirname, '../../resources/data/configuraciones-avanzadas.json')
  return {
    get: async () => await (JSON.parse(readFileSync(urlDataJson).toString()) as ConfiguracionesAvanzadas) ?? null,
    edit: async (value: ConfiguracionesAvanzadas) => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as ConfiguracionesAvanzadas
      data = {...data, ...value}
      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    }
  }
}
