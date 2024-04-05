import { readFileSync } from 'fs'
import path from 'path'

export interface ItemMenu {
  icon: string
  title: string
  link: string
}

export const ItemsMenuStore = () => {
  const urlDataJson = path.join(__dirname, '../../resources/data/items-menu.json')
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemMenu[],
  }
}
