import { readFileSync } from 'fs'

interface Props {
  urlDataJson: string
}

export interface ItemMenu {
  icon: string
  title: string
  link: string
}


export const ItemsMenuStore = ({ urlDataJson }: Props) => {
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemMenu[],
  }
}
