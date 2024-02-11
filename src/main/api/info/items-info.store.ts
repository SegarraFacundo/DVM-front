import { readFileSync } from 'fs'

interface Props {
  urlDataJson: string
}

export interface ItemInfoData {
  icon: string
  title: string
  medicion: string
  info: string
}

export const ItemsInfoStore = ({ urlDataJson }: Props) => {
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemInfoData[],
  }
}
