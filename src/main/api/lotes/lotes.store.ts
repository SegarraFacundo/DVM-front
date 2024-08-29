import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { APP_DATA_PATH } from '../../utils/urls'

export interface ILote {
  id?: number
  name: string
  superficie: string
  ubicacion: string
  geoposicionamiento: {
    lat: number
    long: number
  }
}

export const LotesStore = (): {
  all: () => Promise<ILote[] | undefined>
  get: (id: number) => Promise<ILote | undefined>
  add: (value: ILote) => Promise<ILote | undefined>
  remove: (id: number) => Promise<ILote | undefined>
} => {
  let urlDataJson = path.join(APP_DATA_PATH(), 'lotes.json')
  const urlDataJsonDefault = path.join(__dirname, '../../resources/data/lotes.json')
  if (!existsSync(urlDataJson)) urlDataJson = urlDataJsonDefault
  return {
    all: async (): Promise<ILote[] | undefined> =>
      JSON.parse(await readFileSync(urlDataJson).toString()) as ILote[],
    get: async (id: number): Promise<ILote | undefined> =>
      (await (JSON.parse(readFileSync(urlDataJson).toString()) as ILote[]).find((m) => {
        return m.id === id
      })) ?? undefined,
    add: async (value: ILote): Promise<ILote | undefined> => {
      const data = JSON.parse(readFileSync(urlDataJson).toString()) as ILote[]
      const ultimoLote = data.reduce((accumulator, current) =>
        accumulator.id && current.id && accumulator.id > current.id ? accumulator : current
      )
      const nuevoLote = { ...value, id: ultimoLote.id ? ultimoLote.id + 1 : 1 }

      data.push(nuevoLote)
      await writeFileSync(urlDataJson, JSON.stringify(data))

      return nuevoLote
    },
    remove: async (id: number): Promise<ILote | undefined> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as ILote[]
      const lote = data.find((d) => d.id === id)
      data = data.filter((value) => value.id !== id)
      await writeFileSync(urlDataJson, JSON.stringify(data))
      return lote
    }
  }
}
