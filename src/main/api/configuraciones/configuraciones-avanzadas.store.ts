import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { APP_DATA_PATH } from '../../utils/urls'
import { app } from 'electron'

export type TipoGotaType = 'FINA' | 'MEDIA' | 'GRUESA' | 'CUSTOM'

export interface ConfiguracionesAvanzadas {
  ancho: number
  gota: {
    fina: number
    media: number
    gruesa: number
    custom: number
    seleccionada: TipoGotaType
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

export const ConfiguracionesAvanzadasStore = () => {
  const urlDataJson = '/root/dvm-app-front/configuraciones-avanzadas.json'

  return {
    get: async (): Promise<ConfiguracionesAvanzadas> =>
      (await (JSON.parse(readFileSync(urlDataJson).toString()) as ConfiguracionesAvanzadas)) ??
      null,
    edit: async (value: ConfiguracionesAvanzadas): Promise<ConfiguracionesAvanzadas> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as ConfiguracionesAvanzadas
      data = { ...data, ...value }
      await writeFileSync(urlDataJson, JSON.stringify(data))

      return data
    },
    login: async (password: string): Promise<boolean> => {
      const data = (await JSON.parse(
        readFileSync(urlDataJson).toString()
      )) as ConfiguracionesAvanzadas
      return data.password === password
    }
  }
}
