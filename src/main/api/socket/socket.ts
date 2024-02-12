import * as net from 'net'

const client = new net.Socket()
client.connect({ port: 8080, host: '127.0.0.1' })

export interface DatosMeteorologicos {
  command: 'datosMeteorologicos'
  humedad: number | null
  velViento: number | null
  dirViento: number | null
  temperatura: number | null
  puntoDeRocio: number | null
}

export const asyncEmit = (command: 'datosMeteorologicos'): DatosMeteorologicos => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return new Promise<DatosMeteorologicos>((resolve, reject) => {
    client.on('data', (data) => {
      const infoData = data?.toString('utf-8')
      const infoDataJson = JSON.parse(infoData)
      if (infoDataJson && infoDataJson.command === command) {
        const datosMeteorologicos: DatosMeteorologicos = {
          ...(infoDataJson as DatosMeteorologicos)
        }
        resolve(datosMeteorologicos)
      }
    })
    setTimeout(reject, 1000)
  })
}
