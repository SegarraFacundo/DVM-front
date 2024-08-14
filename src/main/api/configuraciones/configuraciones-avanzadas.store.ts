import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { APP_DATA_PATH } from '../../utils/urls'

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
  let urlDataJson = path.join(APP_DATA_PATH(), 'configuraciones-avanzadas.json')
  const urlDataJsonDefault = path.join(
    __dirname,
    '../../resources/data/configuraciones-avanzadas.json'
  )
  if (!existsSync(urlDataJson)) urlDataJson = urlDataJsonDefault

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