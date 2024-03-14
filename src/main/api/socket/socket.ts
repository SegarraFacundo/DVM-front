import express from 'express'
import { createServer } from 'http'
import { Server as ServerSocket } from 'socket.io'

import * as net from 'net'
import { EstadoAspersorType, EstadoNodo, Nodo, NodosStore } from '../nodos/nodos.store'

//Interfaces de API
// Protocolo de testing:
// {
//     command : "testing",
//     nodos :  [1030, 1230, 1150]
// }

// Protocolo de funcionamiento normal:
// {
//     command : "normal",
//     nodo : 1030,
//     rpm1 : 2000,
//     rpm2 : 2500,
//     rpm3 : 1000,
//     rpm4 : 0,
// }

// Protocolo de datos meteorológicos:
// {
//     command : "datosMeteorologicos",
//     humedad : 78,
//     velViento : 34,
//     dirViento : 180,
//     temperatura : 25,
//     puntoDeRocio : 25
// }

// Protocolo de estado general del nodo:
// {
//     command : "estadoGeneralNodo",
//     nodo : 1030,
//     state1 : 3.1,
//     state2 : 3.2,
//     state3 : 3.3,
//     state4 : 6.2,
//     corr1 : 2000,
//     corr2 : 2500,
//     corr3 : 2000,
//     corr4 : 500,
//     rpm1 : 3.1,
//     rpm2 : 3.2,
//     rpm3 : 3.3,
//     rpm4 : 6.2,
//     voltaje : 12.8
// }

interface ClientToServerEvents {
  testing: () => Promise<boolean>
}

interface ServerToClientEvents {
  getStateNodo: (data: Nodo[]) => void
  getDatosMeteorologicos: (data: DatosMeteorologicos) => void
}

const app = express()
const httpServer = createServer(app)
const io = new ServerSocket<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: '*'
  }
})

const client = new net.Socket()
client.connect({ port: 8080, host: '127.0.0.1' })

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

const datosTestingAsync = async (): Promise<boolean> => {
  const nodosStore = NodosStore()
  const nodos = await nodosStore.all()
  const send = {
    command: 'testing',
    nodos: [nodos.filter((n) => !n.deshabilitado).map((n) => n.id)]
  }
  return client.write(Buffer.from(JSON.stringify(send)))
}

client.on('error', function (err) {
  console.log('Error : ', err)
})

client.on('close', function () {
  console.log('socket closed')
})

io.on('connection', async (socket) => {
  
  const nodosStore = NodosStore()
  let nodos = await nodosStore.all()
  socket.on('testing', () => {
    return datosTestingAsync()
  })

  let estadosNodos: EstadoNodo[]
  console.log('process.env.NODE_ENV: %s', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    
    setInterval(() => {
      estadosNodos = nodos
        .filter((n) => !n.deshabilitado)
        .map<EstadoNodo>((n) => ({
          nodo: n.id,
          state1: getRandomArbitrary(0, 4, 1) as EstadoAspersorType,
          state2: getRandomArbitrary(0, 4, 1) as EstadoAspersorType,
          state3: getRandomArbitrary(0, 4, 1) as EstadoAspersorType,
          state4: getRandomArbitrary(0, 4, 1) as EstadoAspersorType,
          voltaje: getRandomArbitrary(0, 20)
        }))

      const datos: Nodo[] = nodos.map((n) => {
        const estadoNodo = estadosNodos.find((ean) => n.id === ean.nodo)
        return {
          id: n.id,
          nombre: n.nombre,
          deshabilitado: n.deshabilitado ?? false,
          aspersores: [
            {
              id: 1,
              estado: estadoNodo?.state1 ?? -1,
              deshabilitado: n.aspersores.find((a) => a.id === 1)?.deshabilitado ?? false
            },
            {
              id: 2,
              estado: estadoNodo?.state2 ?? -1,
              deshabilitado: n.aspersores.find((a) => a.id === 2)?.deshabilitado ?? false
            },
            {
              id: 3,
              estado: estadoNodo?.state3 ?? -1,
              deshabilitado: n.aspersores.find((a) => a.id === 3)?.deshabilitado ?? false
            },
            {
              id: 4,
              estado: estadoNodo?.state4 ?? -1,
              deshabilitado: n.aspersores.find((a) => a.id === 4)?.deshabilitado ?? false
            }
          ]
        }
      })
      socket.emit('getStateNodo', datos)
    }, 5000)

    setInterval(() => {
      const datos: DatosMeteorologicos = {
        humedad: getRandomArbitrary(0, 100),
        velViento: getRandomArbitrary(0, 100),
        dirViento: getRandomArbitrary(0, 100),
        temperatura: getRandomArbitrary(0, 100),
        puntoDeRocio: getRandomArbitrary(0, 100)
      }
      socket.emit('getDatosMeteorologicos', datos)
    }, 5000)
  } else {
    client.on('data', async (data) => {
      const nodos = await nodosStore.all()
      const infoData = data?.toString('utf-8')
      if (isJsonString(infoData)) {
        const infoDataJson = JSON.parse(infoData)
        if (infoDataJson && infoDataJson.command === 'estadoGeneralNodos') {
          estadosNodos = infoDataJson.nodos
          const datos: Nodo[] = nodos.map((n) => {
            const estadoNodo = estadosNodos.find((ean) => n.id === ean.nodo)
            return {
              id: n.id,
              nombre: n.nombre,
              deshabilitado: n.deshabilitado ?? false,
              aspersores: [
                {
                  id: 1,
                  estado: estadoNodo?.state1 ?? -1,
                  deshabilitado: n.aspersores.find((a) => a.id === 1)?.deshabilitado ?? false
                },
                {
                  id: 2,
                  estado: estadoNodo?.state2 ?? -1,
                  deshabilitado: n.aspersores.find((a) => a.id === 2)?.deshabilitado ?? false
                },
                {
                  id: 3,
                  estado: estadoNodo?.state3 ?? -1,
                  deshabilitado: n.aspersores.find((a) => a.id === 3)?.deshabilitado ?? false
                },
                {
                  id: 4,
                  estado: estadoNodo?.state4 ?? -1,
                  deshabilitado: n.aspersores.find((a) => a.id === 4)?.deshabilitado ?? false
                }
              ]
            }
          })
          socket.emit('getStateNodo', datos)
        }
      }
    })

    client.on('data', (data) => {
      const infoData = data?.toString('utf-8')
      if (isJsonString(infoData)) {
        const infoDataJson = JSON.parse(infoData)
        if (infoDataJson && infoDataJson.command === 'datosMeteorologicos') {
          const datos: DatosMeteorologicos = {
            ...(infoDataJson as DatosMeteorologicos)
          }
          socket.emit('getDatosMeteorologicos', datos)
        }
      }
    })
  }
})

httpServer.listen(3000)
