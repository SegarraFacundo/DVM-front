import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { APP_DATA_PATH } from '../../utils/urls'

export interface Lote {
  id: number
  name: string
}

export const LotesStore = () => {
  let urlDataJson = path.join(APP_DATA_PATH(), 'lotes.json')
  const urlDataJsonDefault = path.join(__dirname, '../../resources/data/lotes.json')
  if (!existsSync(urlDataJson))
    urlDataJson = urlDataJsonDefault
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as Lote[],
    get: async (id: number) =>
      (await (JSON.parse(readFileSync(urlDataJson).toString()) as Lote[]).find((m) => {
        return m.id === id
      })) ?? null,
    add: async (value: { name: string }) => {
      const data = JSON.parse(readFileSync(urlDataJson).toString()) as Lote[]
      const id =
        data.reduce((accumulator, current) => {
          return accumulator.id > current.id ? accumulator : current
        }).id++
      const nuevoLote = { name: value.name, id }

      data.push(nuevoLote)
      await writeFileSync(urlDataJson, JSON.stringify(data))

      return nuevoLote
    },
    remove: async (id: number) => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Lote[]
      const lote = data.find((d) => d.id === id)
      data = data.filter((value) => value.id !== id)
      await writeFileSync(urlDataJson, JSON.stringify(data))
      return lote
    }
  }
}
