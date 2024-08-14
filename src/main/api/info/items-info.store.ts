import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { APP_DATA_PATH } from '../../utils/urls'

export interface ItemInfoData {
  icon: string
  title: string
  medicion: string
  unidad: string
  info: string
}

export const ItemsInfoStore = () => {
  let urlDataJson = path.join(APP_DATA_PATH(), 'items-info.json')
  const urlDataJsonDefault = path.join(__dirname, '../../resources/data/items-info.json')
  if (!existsSync(urlDataJson)) urlDataJson = urlDataJsonDefault
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemInfoData[]
  }
}