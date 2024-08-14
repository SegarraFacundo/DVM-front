import { readFileSync, writeFileSync } from 'fs'

export interface Unidad {
  id: 1 | 2
  tipo: 'velocidad' | 'temperatura'
  unidad: 'Km/h' | 'mi/h' | 'C' | 'F'
  estaSeleccionada: boolean
}

export const UnidadesStore = () => {
  const urlDataJson = '/root/dvm-app-front/unidades.json'

  return {
    all: async (): Promise<Unidad[]> =>
      JSON.parse(await readFileSync(urlDataJson).toString()) as Unidad[],
    cambiarUnidadVelocidad: async (id: 1 | 2): Promise<boolean> => {
      try {
        const data = (JSON.parse(await readFileSync(urlDataJson).toString()) as Unidad[]).map(
          (u) => {
            if (u.tipo === 'velocidad') u.estaSeleccionada = u.id === id
            return u
          }
        )
        await writeFileSync(urlDataJson, JSON.stringify(data))
        return true
      } catch (e) {
        return false
      }
    },
    cambiarUnidadTemperatura: async (id: 1 | 2): Promise<boolean> => {
      try {
        const data = (JSON.parse(await readFileSync(urlDataJson).toString()) as Unidad[]).map(
          (u) => {
            if (u.tipo === 'temperatura') u.estaSeleccionada = u.id === id
            return u
          }
        )
        await writeFileSync(urlDataJson, JSON.stringify(data))
        return true
      } catch (e) {
        return false
      }
    }
  }
}
