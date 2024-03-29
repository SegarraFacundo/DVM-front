import express from 'express'
import { createServer } from 'http'
import { Server as ServerSocket } from 'socket.io'

import * as net from 'net'
import {
  IdsEstadoAspersorType,
  EstadoNodoTesting,
  EstadoNodoJob,
  Nodo,
  NodosStore,
  DescripcionEstadoAspersorType
} from '../nodos/nodos.store'

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
//     rpm3 : 3.3,//     rpm4 : 6.2,
//     voltaje : 12.8
// }

interface ClientToServerEvents {
  testing: () => void
  startJob: (rpmDeseado: number) => void
  stopJob: () => void
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
if (process.env.NODE_ENV === 'development') client.connect({ port: 8080, host: '127.0.0.1' })

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
  cantidadDecimales: number = 2 /* Dos decimales */
): number => {
  const rand = Math.random() * (max - min) + min
  const power = Math.pow(10, cantidadDecimales)
  return Math.floor(rand * power) / power
}

// {
//     command : "normal",
//     nodo : 1030,
//     rpm1 : 2000,
//     rpm2 : 2500,
//     rpm3 : 1000,
//     rpm4 : 0,
// }

const startJob = (nodo: Nodo): boolean => {
  const send = {
    command: 'normal',
    nodo: nodo.id,
    rpm1:
      nodo.deshabilitado || nodo.aspersores[0].deshabilitado
        ? 0
        : nodo.aspersores[0].rpmDeseado ?? 0,
    rpm2:
      nodo.deshabilitado || nodo.aspersores[1].deshabilitado
        ? 0
        : nodo.aspersores[1].rpmDeseado ?? 0,
    rpm3:
      nodo.deshabilitado || nodo.aspersores[2].deshabilitado
        ? 0
        : nodo.aspersores[2].rpmDeseado ?? 0,
    rpm4:
      nodo.deshabilitado || nodo.aspersores[3].deshabilitado
        ? 0
        : nodo.aspersores[3].rpmDeseado ?? 0
  }
  console.log(send)
  return client.write(Buffer.from(JSON.stringify(send)))
}

const getDescripcionEstado = (idEstado: IdsEstadoAspersorType): DescripcionEstadoAspersorType => {
  let value: DescripcionEstadoAspersorType = ''
  switch (idEstado) {
    case -1:
      value = ''
      break
    case 0:
      value = 'OK'
      break
    case 1:
      value = 'Falla en el sensor'
      break
    case 2:
      value = 'Bloqueo del motor'
      break
    case 3:
      value = 'Sobrecalentamiento del motor'
      break
    case 4:
      value = 'Motor desconectado'
      break
    case 5:
      value = '5 Preguntar'
      break
  }
  return value
}

const startTestingAsync = async (socket): Promise<void> => {
  const nodosStore = NodosStore()
  const nodos = await nodosStore.all()
  const send = {
    command: 'testing',
    nodos: nodos.map((n) => n.id)
  }
  if (process.env.NODE_ENV !== 'development') {
    let estadosNodosTesting: EstadoNodoTesting[]
    let nodos = await nodosStore.all()
    estadosNodosTesting = nodos.map<EstadoNodoTesting>((n) => ({
      command: 'testing',
      nodo: n.id,
      state1: getRandomArbitrary(0, 5, 0) as IdsEstadoAspersorType,
      state2: getRandomArbitrary(0, 5, 0) as IdsEstadoAspersorType,
      state3: getRandomArbitrary(0, 5, 0) as IdsEstadoAspersorType,
      state4: getRandomArbitrary(0, 5, 0) as IdsEstadoAspersorType,
      voltaje: getRandomArbitrary(0, 20)
    }))

    const datos: Nodo[] = nodos.map((n) => {
      const estadoNodo = estadosNodosTesting.find((ean) => n.id === ean.nodo)
      return {
        id: n.id,
        nombre: n.nombre,
        deshabilitado: n.deshabilitado ?? false,
        aspersores: [
          {
            id: 1,
            estado: {
              id: estadoNodo?.state1 ?? -1,
              descripcion: getDescripcionEstado(estadoNodo?.state1 ?? -1)
            },
            deshabilitado: n.aspersores.find((a) => a.id === 1)?.deshabilitado ?? false
          },
          {
            id: 2,
            estado: {
              id: estadoNodo?.state2 ?? -1,
              descripcion: getDescripcionEstado(estadoNodo?.state2 ?? -1)
            },
            deshabilitado: n.aspersores.find((a) => a.id === 2)?.deshabilitado ?? false
          },
          {
            id: 3,
            estado: {
              id: estadoNodo?.state3 ?? -1,
              descripcion: getDescripcionEstado(estadoNodo?.state3 ?? -1)
            },
            deshabilitado: n.aspersores.find((a) => a.id === 3)?.deshabilitado ?? false
          },
          {
            id: 4,
            estado: {
              id: estadoNodo?.state4 ?? -1,
              descripcion: getDescripcionEstado(estadoNodo?.state4 ?? -1)
            },
            deshabilitado: n.aspersores.find((a) => a.id === 4)?.deshabilitado ?? false
          }
        ]
      }
    })
    socket.emit('getStateNodo', datos)
  } else {
    client.write(Buffer.from(JSON.stringify(send)))
  }
}

client.on('error', function (err) {
  console.log('Error : ', err)
})

client.on('close', function () {
  console.log('socket closed')
})

io.on('connection', async (socket) => {
  let runningJob = false
  const nodosStore = NodosStore()
  socket.on('testing', () => {
    startTestingAsync(socket)
  })

  socket.on('startJob', async (rpmDeseado: number) => {
    runningJob = true
    listenJob()
    await nodosStore.startAllNodo(rpmDeseado)
    let nodos = await nodosStore.all()
    nodos.forEach((n) => startJob(n))
  })

  socket.on('stopJob', async () => {
    runningJob = false
    await nodosStore.stopAllNodos()
    let nodos = await nodosStore.all()
    nodos.forEach((n) => startJob(n))
  })

  let estadosNodosJob: EstadoNodoJob[]
  console.log('process.env.NODE_ENV: %s', process.env.NODE_ENV)

  const listenJob = () => {
    if (process.env.NODE_ENV !== 'development') {
      let refreshIntervalId = setInterval(async () => {
        if (!runningJob) {
          clearInterval(refreshIntervalId)
          return
        }
        let nodos = await nodosStore.all()
        estadosNodosJob = nodos.map<EstadoNodoJob>((n) => ({
          command: 'estadoGeneralNodo',
          nodo: n.id,
          state1: getRandomArbitrary(0, 5, 0) as IdsEstadoAspersorType,
          state2: getRandomArbitrary(0, 5, 0) as IdsEstadoAspersorType,
          state3: getRandomArbitrary(0, 5, 0) as IdsEstadoAspersorType,
          state4: getRandomArbitrary(0, 5, 0) as IdsEstadoAspersorType,
          voltaje: getRandomArbitrary(0, 20, 2),
          corr1: getRandomArbitrary(0, 9, 2),
          corr2: getRandomArbitrary(0, 9, 2),
          corr3: getRandomArbitrary(0, 9, 2),
          corr4: getRandomArbitrary(0, 9, 2),
          rpm1: getRandomArbitrary(0, 9999, 0),
          rpm2: getRandomArbitrary(0, 9999, 0),
          rpm3: getRandomArbitrary(0, 9999, 0),
          rpm4: getRandomArbitrary(0, 9999, 0)
        }))

        const datos: Nodo[] = nodos.map((n) => {
          const estadoNodo = estadosNodosJob.find((ean) => n.id === ean.nodo)
          return {
            id: n.id,
            nombre: n.nombre,
            deshabilitado: n.deshabilitado ?? false,
            aspersores: [
              {
                id: 1,
                estado: {
                  id: estadoNodo?.state1 ?? -1,
                  descripcion: getDescripcionEstado(estadoNodo?.state1 ?? -1)
                },
                rpm: estadoNodo?.rpm1,
                rpmDeseado: n.aspersores.find((a) => a.id === 1)?.rpmDeseado,
                deshabilitado:
                  (n.aspersores.find((a) => a.id === 1)?.deshabilitado ?? false) ||
                  estadoNodo?.rpm1 === 0
              },
              {
                id: 2,
                estado: {
                  id: estadoNodo?.state2 ?? -1,
                  descripcion: getDescripcionEstado(estadoNodo?.state2 ?? -1)
                },
                rpm: estadoNodo?.rpm2,
                rpmDeseado: n.aspersores.find((a) => a.id === 2)?.rpmDeseado,
                deshabilitado:
                  (n.aspersores.find((a) => a.id === 2)?.deshabilitado ?? false) ||
                  estadoNodo?.rpm2 === 0
              },
              {
                id: 3,
                estado: {
                  id: estadoNodo?.state3 ?? -1,
                  descripcion: getDescripcionEstado(estadoNodo?.state3 ?? -1)
                },
                rpm: estadoNodo?.rpm3,
                rpmDeseado: n.aspersores.find((a) => a.id === 3)?.rpmDeseado,
                deshabilitado:
                  (n.aspersores.find((a) => a.id === 3)?.deshabilitado ?? false) ||
                  estadoNodo?.rpm3 === 0
              },
              {
                id: 4,
                estado: {
                  id: estadoNodo?.state4 ?? -1,
                  descripcion: getDescripcionEstado(estadoNodo?.state4 ?? -1)
                },
                rpm: estadoNodo?.rpm4,
                rpmDeseado: n.aspersores.find((a) => a.id === 4)?.rpmDeseado,
                deshabilitado:
                  (n.aspersores.find((a) => a.id === 4)?.deshabilitado ?? false) ||
                  estadoNodo?.rpm4 === 0
              }
            ]
          }
        })
        socket.emit('getStateNodo', datos)
      }, 5000)
    } else {
      client.on('data', async (data) => {
        if (!runningJob) {
          return
        }
        const nodos = await nodosStore.all()
        const infoData = data?.toString('utf-8')
        if (isJsonString(infoData)) {
          const infoDataJson = JSON.parse(infoData)
          if (infoDataJson && infoDataJson.command === 'estadoGeneralNodos') {
            estadosNodosJob = infoDataJson.nodos
            const datos: Nodo[] = nodos.map((n) => {
              const estadoNodo = estadosNodosJob.find((ean) => n.id === ean.nodo)
              return {
                id: n.id,
                nombre: n.nombre,
                deshabilitado: n.deshabilitado ?? false,
                aspersores: [
                  {
                    id: 1,
                    estado: {
                      id: estadoNodo?.state1 ?? -1,
                      descripcion: getDescripcionEstado(estadoNodo?.state1 ?? -1)
                    },
                    rpm: estadoNodo?.rpm1,
                    rpmDeseado: n.aspersores.find((a) => a.id === 1)?.rpmDeseado,
                    deshabilitado: n.aspersores.find((a) => a.id === 1)?.deshabilitado ?? false
                  },
                  {
                    id: 2,
                    estado: {
                      id: estadoNodo?.state2 ?? -1,
                      descripcion: getDescripcionEstado(estadoNodo?.state2 ?? -1)
                    },
                    rpm: estadoNodo?.rpm2,
                    rpmDeseado: n.aspersores.find((a) => a.id === 2)?.rpmDeseado,
                    deshabilitado: n.aspersores.find((a) => a.id === 2)?.deshabilitado ?? false
                  },
                  {
                    id: 3,
                    estado: {
                      id: estadoNodo?.state3 ?? -1,
                      descripcion: getDescripcionEstado(estadoNodo?.state3 ?? -1)
                    },
                    rpm: estadoNodo?.rpm3,
                    rpmDeseado: n.aspersores.find((a) => a.id === 3)?.rpmDeseado,
                    deshabilitado: n.aspersores.find((a) => a.id === 3)?.deshabilitado ?? false
                  },
                  {
                    id: 4,
                    estado: {
                      id: estadoNodo?.state4 ?? -1,
                      descripcion: getDescripcionEstado(estadoNodo?.state4 ?? -1)
                    },
                    rpm: estadoNodo?.rpm4,
                    rpmDeseado: n.aspersores.find((a) => a.id === 4)?.rpmDeseado,
                    deshabilitado: n.aspersores.find((a) => a.id === 4)?.deshabilitado ?? false
                  }
                ]
              }
            })
            socket.emit('getStateNodo', datos)
          }
        }
      })
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    setInterval(async () => {
      const datos: DatosMeteorologicos = {
        humedad: getRandomArbitrary(0, 100, 0),
        velViento: getRandomArbitrary(0, 100, 0),
        dirViento: getRandomArbitrary(0, 360, 0),
        temperatura: getRandomArbitrary(0, 100, 0),
        puntoDeRocio: getRandomArbitrary(0, 100, 0)
      }
      socket.emit('getDatosMeteorologicos', datos)
    }, 5000)
  } else {
    client.on('data', async (data) => {
      const infoData = data?.toString('utf-8')
      if (isJsonString(infoData)) {
        const infoDataJson = JSON.parse(infoData)
        if (infoDataJson && infoDataJson.command === 'datosMeteorologicos') {
          const datos: DatosMeteorologicos = {
            ...(infoDataJson as DatosMeteorologicos)
          }
          socket.emit('getDatosMeteorologicos', datos)
        }
        if (infoDataJson && infoDataJson.command === 'estadoGeneralNodos') {
          estadosNodosJob = infoDataJson.nodos
          const nodos = await nodosStore.all()
          const datos: Nodo[] = nodos.map((n) => {
            const estadoNodo = estadosNodosJob.find((ean) => n.id === ean.nodo)
            return {
              id: n.id,
              nombre: n.nombre,
              deshabilitado: n.deshabilitado ?? false,
              aspersores: [
                {
                  id: 1,
                  estado: {
                    id: estadoNodo?.state1 ?? -1,
                    descripcion: getDescripcionEstado(estadoNodo?.state1 ?? -1)
                  },
                  rpm: estadoNodo?.rpm1,
                  rpmDeseado: n.aspersores.find((a) => a.id === 1)?.rpmDeseado,
                  deshabilitado: n.aspersores.find((a) => a.id === 1)?.deshabilitado ?? false
                },
                {
                  id: 2,
                  estado: {
                    id: estadoNodo?.state2 ?? -1,
                    descripcion: getDescripcionEstado(estadoNodo?.state2 ?? -1)
                  },
                  rpm: estadoNodo?.rpm2,
                  rpmDeseado: n.aspersores.find((a) => a.id === 2)?.rpmDeseado,
                  deshabilitado: n.aspersores.find((a) => a.id === 2)?.deshabilitado ?? false
                },
                {
                  id: 3,
                  estado: {
                    id: estadoNodo?.state3 ?? -1,
                    descripcion: getDescripcionEstado(estadoNodo?.state3 ?? -1)
                  },
                  rpm: estadoNodo?.rpm3,
                  rpmDeseado: n.aspersores.find((a) => a.id === 3)?.rpmDeseado,
                  deshabilitado: n.aspersores.find((a) => a.id === 3)?.deshabilitado ?? false
                },
                {
                  id: 4,
                  estado: {
                    id: estadoNodo?.state4 ?? -1,
                    descripcion: getDescripcionEstado(estadoNodo?.state4 ?? -1)
                  },
                  rpm: estadoNodo?.rpm4,
                  rpmDeseado: n.aspersores.find((a) => a.id === 4)?.rpmDeseado,
                  deshabilitado: n.aspersores.find((a) => a.id === 4)?.deshabilitado ?? false
                }
              ]
            }
          })
          socket.emit('getStateNodo', datos)
        }
      }
    })
  }
})

httpServer.listen(3000)
