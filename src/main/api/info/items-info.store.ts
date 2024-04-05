import { readFileSync } from 'fs'
import path from 'path'

export interface ItemInfoData {
  icon: string
  title: string
  medicion: string
  unidad: string
  info: string
}

export const ItemsInfoStore = () => {
  const urlDataJson = path.join(__dirname, '../../resources/data/items-info.json')
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemInfoData[],
  }
}
