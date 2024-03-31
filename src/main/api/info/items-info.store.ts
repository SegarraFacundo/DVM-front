import { readFileSync } from 'fs'
import path from 'path'

interface Props {
  urlDataJson: string
}

export interface ItemInfoData {
  icon: string
  title: string
  medicion: string
  unidad: string
  info: string
}

export const ItemsInfoStore = ({ urlDataJson }: Props) => {
  urlDataJson = path.join(__dirname, '../../resources/data/', `${urlDataJson}`)
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as ItemInfoData[],
  }
}
