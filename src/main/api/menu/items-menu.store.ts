import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { APP_DATA_PATH } from '../../utils/urls'

export interface ItemMenu {
  icon: string
  title: string
  link: string
}

export const ItemsMenuStore = () => {
  let urlDataJson = path.join(APP_DATA_PATH(), 'items-menu.json')
  const urlDataJsonDefault = path.join(__dirname, '../../resources/data/items-menu.json')
  if (!existsSync(urlDataJson)) urlDataJson = urlDataJsonDefault
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemMenu[]
  }
}