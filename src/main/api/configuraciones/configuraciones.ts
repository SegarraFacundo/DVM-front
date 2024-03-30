import brightness from 'brightness'

export const Configuraciones = () => {
  return {
    setBrillo: async (porcentaje: number): Promise<void> => brightness.set(porcentaje / 100),
    getBrilloActual: async (): Promise<number> => (await brightness.get()) * 100
  }
}
