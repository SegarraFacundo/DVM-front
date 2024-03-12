import * as net from 'net'

const client = new net.Socket()
client.connect({ port: 8080, host: 'localhost' })

export interface Datos<T> {
  command: string
  data: T
}

export interface EstadoNodo {
  nodo: number
  state1: number
  state2: number
  state3: number
  state4: number
  voltaje: number
}

export interface DatosMeteorologicos {
  humedad: number | null
  velViento: number | null
  dirViento: number | null
  temperatura: number | null
  puntoDeRocio: number | null
}

const isJsonString = (value: string): boolean => {
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true
}

const getRandomArbitrary = (
  min: number,
  max: number,
  cantidadDecimales: number = 100 /* Dos decimales */
): number =>
  Math.floor(
    Math.random() * (max * cantidadDecimales - min * cantidadDecimales) * cantidadDecimales
  ) /
  (1 * cantidadDecimales)

export const datosMeteorologicosEmitAsync = (): Promise<Datos<DatosMeteorologicos>> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return new Promise<Datos>((resolve, reject) => {
    client.on('data', (data) => {
      const infoData = data?.toString('utf-8')
      if (isJsonString(infoData)) {
        const infoDataJson = JSON.parse(infoData)
        if (infoDataJson && infoDataJson.command === 'datosMeteorologicos') {
          const datos: Datos<DatosMeteorologicos> = {
            command: infoDataJson.command,
            data: { ...(infoDataJson as DatosMeteorologicos) }
          }
          resolve(datos)
        }
      }
    })
    setTimeout(reject, 1000)
  })

  // return new Promise<Datos>((resolve) => {
  //   setInterval(() => {
  //     const datos: Datos<DatosMeteorologicos> = {
  //       command: 'datosMeteorologicos',
  //       data: {
  //         humedad: getRandomArbitrary(0, 100),
  //         velViento: getRandomArbitrary(0, 100),
  //         dirViento: getRandomArbitrary(0, 100),
  //         temperatura: getRandomArbitrary(0, 100),
  //         puntoDeRocio: getRandomArbitrary(0, 100)
  //       }
  //     }
  //     resolve(datos)
  //   }, 5000)
  // })
}

export const datosTestingAsync = (): void => {
  const send = {
    command: 'testing',
    nodos: [1025]
  }
  client.write(Buffer.from(JSON.stringify(send)))
}

export const getStateNodoAsync = (): Promise<Datos<{ nodos: EstadoNodo[] }> | undefined> => {
  return new Promise<Datos<{ nodos: EstadoNodo[] }>>((resolve, reject) => {
    client.on('data', (data) => {
      const infoData = data?.toString('utf-8')
      if (isJsonString(infoData)) {
        const infoDataJson = JSON.parse(infoData)
        if (infoDataJson && infoDataJson.command === 'estadoGeneralNodos') {
          const datos: Datos<{ nodos: EstadoNodo[] }> = {
            command: 'infoDataJson.command',
            data: { nodos: infoDataJson.nodos }
          }
          resolve(datos)
        }
      }
    })
    setTimeout(reject, 1000)
  })

  // return new Promise<Datos<{ nodos: EstadoNodo[] }>>((resolve) => {
  //   setInterval(() => {
  //     const datos: Datos<{ nodos: EstadoNodo[] }> = {
  //       command: 'estadoGeneralNodos',
  //       data: {
  //         nodos: [
  //           1015
  //         ].map((v) => ({
  //           nodo: v,
  //           state1: 0,
  //           state2: getRandomArbitrary(0, 4, 1),
  //           state3: getRandomArbitrary(0, 4, 1),
  //           state4: getRandomArbitrary(0, 4, 1),
  //           voltaje: getRandomArbitrary(0, 20)
  //         }))
  //       }
  //     }
  //     resolve(datos)
  //   }, 5000)
  // })
}

client.on('error', function (err) {
  console.log('Error : ', err)
})

client.on('close', function () {
  console.log('socket closed')
})
