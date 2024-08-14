import { readFileSync } from 'fs'

export interface ItemInfoData {
  icon: string
  title: string
  medicion: string
  unidad: string
  info: string
}

export const ItemsInfoStore = () => {
  const urlDataJson = '/root/dvm-app-front/items-info.json'
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemInfoData[]
  }
}
