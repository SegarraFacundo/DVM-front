import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

export interface Unidad {
  id: 1 | 2
  tipo: 'velocidad' | 'temperatura'
  unidad: 'Km/h' | 'mi/h' | '°C' | '°F'
  estaSeleccionada: boolean
}

export const UnidadesStore = () => {
  const urlDataJson = path.join(__dirname, '../../resources/data/unidades.json')
  return {
    all: async () => JSON.parse(await readFileSync(urlDataJson).toString()) as Unidad[],
    cambiarUnidadVelocidad: async (id: 1 | 2) => {
      const data = (JSON.parse(await readFileSync(urlDataJson).toString()) as Unidad[]).map((u) => {
        if (u.tipo === 'velocidad') u.estaSeleccionada = u.id === id
        return u
      })
      await writeFileSync(urlDataJson, JSON.stringify(data))
    },
    cambiarUnidadTemperatura: async (id: 1 | 2) =>{
      const data = (JSON.parse(await readFileSync(urlDataJson).toString()) as Unidad[]).map((u) => {
        if (u.tipo === 'temperatura') u.estaSeleccionada = u.id === id
        return u
      })
      await writeFileSync(urlDataJson, JSON.stringify(data))
    }
  }
}
