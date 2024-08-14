import { readFileSync } from 'fs'

export interface ItemMenu {
  icon: string
  title: string
  link: string
}

export const ItemsMenuStore = () => {
  const urlDataJson = '/root/dvm-app-front/items-menu.json'
  
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemMenu[]
  }
}
