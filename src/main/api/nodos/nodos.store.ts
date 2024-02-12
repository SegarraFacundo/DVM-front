import { readFileSync } from 'fs'
import path from 'path'

interface Props {
  urlDataJson: string
}

interface Aspersor {
  id: string
  estado: 'normal' | 'warning' | 'error' | ''
}
export interface Nodo {
  nodo: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'
  aspersores: Aspersor[]
}


export const NodosStore = ({ urlDataJson }: Props) => {
  urlDataJson = path.join(__dirname, '../../resources/data/', `${urlDataJson}`)
  return {
    all: async (): Promise<Nodo[]> => JSON.parse(await readFileSync(urlDataJson).toString()) as Nodo[]
  }
}
