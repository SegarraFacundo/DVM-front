import { readFileSync, writeFileSync } from 'fs'

export interface Operario {
  id: number
  name: string
  seleccionado?: boolean
}

export const OperariosStore = () => {
  const urlDataJson = '/root/dvm-app-front/operarios.json'

  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as Operario[],
    get: async (id: number) =>
      (await (JSON.parse(readFileSync(urlDataJson).toString()) as Operario[]).find((m) => {
        return m.id === id
      })) ?? null,
    add: async (value: { name: string }) => {
      const data = JSON.parse(readFileSync(urlDataJson).toString()) as Operario[]
      const id = data.reduce((accumulator, current) => {
        return accumulator.id > current.id ? accumulator : current
      }).id++
      const nuevoOperario = { name: value.name, id }

      data.push(nuevoOperario)
      await writeFileSync(urlDataJson, JSON.stringify(data))

      return nuevoOperario
    },
    remove: async (id: number) => {
      let data = JSON.parse(readFileSync(urlDataJson).toString()) as Operario[]
      const operario = data.find((d) => d.id === id)
      data = data.filter((value) => value.id !== id)
      await writeFileSync(urlDataJson, JSON.stringify(data))
      return operario
    }
  }
}
