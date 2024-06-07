import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { APP_DATA_PATH } from '../../utils/urls'

interface Props {
  urlDataJson: string
}

export interface TipoAplicacion {
  id: number
  name: string
}

export const TiposAplicacionesStore = () => {
  let urlDataJson = path.join(APP_DATA_PATH(), 'tipos-aplicaciones.json')
  const urlDataJsonDefault = path.join(__dirname, '../../resources/data/tipos-aplicaciones.json')
  if (!existsSync(urlDataJson)) urlDataJson = urlDataJsonDefault
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as TipoAplicacion[],
    get: async (id: number) =>
      (await (JSON.parse(readFileSync(urlDataJson).toString()) as TipoAplicacion[]).find((m) => {
        return m.id === id
      })) ?? null,
    add: async (value: { name: string }) => {
      const data = JSON.parse(readFileSync(urlDataJson).toString()) as TipoAplicacion[]
      const id = data.reduce((accumulator, current) => {
        return accumulator.id > current.id ? accumulator : current
      }).id++
      const nuevoTipoAplicacion = { name: value.name, id }

      data.push(nuevoTipoAplicacion)
      await writeFileSync(urlDataJson, JSON.stringify(data))

      return nuevoTipoAplicacion
    },
    remove: async (id: number) => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as TipoAplicacion[]
      const tipoAplicacion = data.find((d) => d.id === id)
      data = data.filter((value) => value.id !== id)
      await writeFileSync(urlDataJson, JSON.stringify(data))
      return tipoAplicacion
    }
  }
}
