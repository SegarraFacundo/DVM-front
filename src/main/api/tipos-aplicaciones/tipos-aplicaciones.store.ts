import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { APP_DATA_PATH } from '../../utils/urls'

export interface ITipoAplicacion {
  id?: number
  name: string
  tipoCultivo: string
  recetaAgronomica: string
}

export const TiposAplicacionesStore = (): {
  all: () => Promise<ITipoAplicacion[] | null>
  get: (id: number) => Promise<ITipoAplicacion | null>
  add: (value: ITipoAplicacion) => Promise<ITipoAplicacion | undefined>
  remove: (id: number) => Promise<ITipoAplicacion | undefined>
} => {
  let urlDataJson = path.join(APP_DATA_PATH(), 'tipos-aplicaciones.json')
  const urlDataJsonDefault = path.join(__dirname, '../../resources/data/tipos-aplicaciones.json')
  if (!existsSync(urlDataJson)) urlDataJson = urlDataJsonDefault
  return {
    all: async (): Promise<ITipoAplicacion[] | null> =>
      JSON.parse(await readFileSync(urlDataJson).toString()) as ITipoAplicacion[],
    get: async (id: number): Promise<ITipoAplicacion | null> =>
      (await (JSON.parse(readFileSync(urlDataJson).toString()) as ITipoAplicacion[]).find((m) => {
        return m.id === id
      })) ?? null,
    add: async (value: ITipoAplicacion): Promise<ITipoAplicacion | undefined> => {
      const data = JSON.parse(readFileSync(urlDataJson).toString()) as ITipoAplicacion[]
      const ultimo = data.reduce((accumulator, current) =>
        accumulator.id && current.id && accumulator.id > current.id ? accumulator : current
      )
      const nuevoTipoAplicacion = { ...value, id: ultimo.id ? ultimo.id + 1 : 1 }

      data.push(nuevoTipoAplicacion)
      await writeFileSync(urlDataJson, JSON.stringify(data))

      return nuevoTipoAplicacion
    },
    remove: async (id: number): Promise<ITipoAplicacion | undefined> => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as ITipoAplicacion[]
      const tipoAplicacion = data.find((d) => d.id === id)
      data = data.filter((value) => value.id !== id)
      await writeFileSync(urlDataJson, JSON.stringify(data))
      return tipoAplicacion
    }
  }
}
