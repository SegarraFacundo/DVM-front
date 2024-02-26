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

const isJsonString = (value: string) => {
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true
}

export const datosMeteorologicosEmitAsync = (): DatosMeteorologicos => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return new Promise<DatosMeteorologicos>((resolve, reject) => {
    client.on('data', (data) => {
      const infoData = data?.toString('utf-8')
      if (isJsonString(infoData)) {
        const infoDataJson = JSON.parse(infoData)
        if (infoDataJson && infoDataJson.command === 'datosMeteorologicos') {
          const datosMeteorologicos: DatosMeteorologicos = {
            ...(infoDataJson as DatosMeteorologicos)
          }
          resolve(datosMeteorologicos)
        }
      }
    })
    setTimeout(reject, 1000)
  })
}

export const datosTestingAsync = (): void => {
  const send = {
    command: 'testing',
    nodes: [1001]
  }
  client.write(Buffer.from(JSON.stringify(send)))
}

client.on('error', function (err) {
  console.log('Error : ', err)
})

client.on('close', function () {
  console.log('socket closed')
})
