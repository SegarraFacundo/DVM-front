import { readFileSync } from 'fs'
import path from 'path'

interface Props {
  urlDataJson: string
}

export interface ItemMenu {
  icon: string
  title: string
  link: string
}


export const ItemsMenuStore = ({ urlDataJson }: Props) => {
  urlDataJson = path.join(__dirname, '../../resources/data/', `${urlDataJson}`)
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemMenu[],
  }
}
