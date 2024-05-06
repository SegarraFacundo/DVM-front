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
  setConfiguracion: (value: {
    variacionRPM: number
    subcorriente: number
    sobrecorriente: number
    cortocicuito: number
    sensor: boolean
    electrovalvula: boolean
  }) => void
  scan: () => void
  renombrar: (idNodo: number, nuevoIdNodo: number) => void
}

export interface DatosMeteorologicos {
  humedad: number | null
  velViento: number | null
  dirViento: number | null
  temperatura: number | null
  puntoDeRocio: number | null
}

interface ServerToClientEvents {
  getStateNodo: (data: Nodo[]) => void
  getDatosMeteorologicos: (data: DatosMeteorologicos) => void
  conectado: () => void
  rtaScan: (data: number[]) => void
  desconectado: () => void
  error: (err: any) => void
}

try {
  const app = express()
  const httpServer = createServer(app)
  const io = new ServerSocket<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: '*'
    }
  })

  const client = new net.Socket()
  client.connect({ port: 8080, host: '127.0.0.1' })


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

    console.info('Comenzo el trabajo: %j', send)

    return client.write(Buffer.from(JSON.stringify(send)))
  }

  const scan = (): boolean => {
    const send = {
      command: 'scan'
    }

    console.info('Comenzo el escaneo de nodos: %j', send)

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
        value = 'Cortocircuito'
        break
      case 2:
        value = 'Motor bloqueado'
        break
      case 3:
        value = 'Motor no conectado'
        break
      case 4:
        value = 'Sobrecorriente'
        break
      case 5:
        value = 'Subcorriente'
        break
      case 6:
        value = 'Baja tension'
        break
      case 7:
        value = 'Error de sensor'
        break
      case 8:
        value = 'RPM no alcanzada'
        break
      case 9:
        value = 'Error de caudalimetro'
        break
    }
    return value
  }

  const startTestingAsync = async (socket): Promise<void> => {
    console.info('Iniciando el testing...')
    const nodosStore = NodosStore()
    const nodos = await nodosStore.all()
    const send = {
      command: 'testing',
      nodos: nodos.map((n) => n.id)
    }
    if (process.env.NODE_ENV === 'development') {
      const nodos = await nodosStore.all()
      const estadosNodosTesting = nodos.map<EstadoNodoTesting>((n) => ({
        command: 'testing',
        nodo: n.id,
        state1: getRandomArbitrary(0, 9, 0) as IdsEstadoAspersorType,
        state2: getRandomArbitrary(0, 9, 0) as IdsEstadoAspersorType,
        state3: getRandomArbitrary(0, 9, 0) as IdsEstadoAspersorType,
        state4: getRandomArbitrary(0, 9, 0) as IdsEstadoAspersorType,
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
      console.info('Comenzo el testing: %j', send)
      client.write(Buffer.from(JSON.stringify(send)))
    }
  }

  client.on('error', function (err) {
    console.error('Error socket: ', err)
    io.emit('error', err)
  })

  client.on('close', function () {
    console.warn('socket closed')
    io.emit('desconectado')
  })

  io.on('connection', async (socket) => {
    console.info('Socket conectado...')
    let runningJob = false
    const nodosStore = NodosStore()
    socket.on('testing', () => {
      startTestingAsync(socket)
    })

    socket.on('startJob', (rpmDeseado: number) => {
      console.info('Comenzo el trabajo con RPM deseado:', rpmDeseado)
      runningJob = true
      listenJob()
      nodosStore.startAllNodo(rpmDeseado).then(() => {
        nodosStore
          .all()
          .then((nodos) => nodos.forEach((n, i) => setTimeout(() => startJob(n), i * 1000)))
      })
    })

    socket.on('scan', () => {
      scan()
    })

    socket.on('renombrar', (idNodo: number, nuevoIdNodo: number) => {
      const send = {
        command: 'renombrar',
        nodo: idNodo,
        nodoNombreNuevo: nuevoIdNodo
      }

      console.info(`Renombramos el nodo id ${send.nodo} a ${send.nodoNombreNuevo}`)

      return client.write(Buffer.from(JSON.stringify(send)))
    })

    socket.on(
      'setConfiguracion',
      async (value: {
        variacionRPM: number
        subcorriente: number
        sobrecorriente: number
        cortocicuito: number
        sensor: boolean
        electrovalvula: boolean
      }) => {
        const nodos = await nodosStore.all()

        const send = {
          command: 'setConfiguracion',
          configuraciones: nodos.map((n) => ({
            nodo: n.id,
            ...value,
            sensor: value.sensor ? 1 : 0,
            electrovalvula: value.electrovalvula ? 1 : 0
          }))
        }

        console.info(`Nueva configuracion: ${JSON.stringify(send)}`)

        return client.write(Buffer.from(JSON.stringify(send)))
      }
    )

    socket.on('stopJob', () => {
      runningJob = false
      nodosStore.stopAllNodos().then(() => {
        nodosStore
          .all()
          .then((nodos) => nodos.forEach((n, i) => setTimeout(() => startJob(n), i * 1000)))
      })
    })

    let estadosNodosJob: EstadoNodoJob[]

    const listenJob = (): void => {
      if (process.env.NODE_ENV === 'development') {
        const refreshIntervalId = setInterval(async () => {
          if (!runningJob) {
            clearInterval(refreshIntervalId)
            return
          }
          const nodos = await nodosStore.all()
          estadosNodosJob = nodos.map<EstadoNodoJob>((n) => ({
            command: 'estadoGeneralNodo',
            nodo: n.id,
            state1: getRandomArbitrary(0, 9, 0) as IdsEstadoAspersorType,
            state2: getRandomArbitrary(0, 9, 0) as IdsEstadoAspersorType,
            state3: getRandomArbitrary(0, 9, 0) as IdsEstadoAspersorType,
            state4: getRandomArbitrary(0, 9, 0) as IdsEstadoAspersorType,
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

              console.info('Emitiendo estado del nodo: %j', datos)
              socket.emit('getStateNodo', datos)
            }
          }
        })
      }
    }

    if (process.env.NODE_ENV === 'development') {
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
            console.info('Emitiendo datos meteorologicos: %j', datos)
            socket.emit('getDatosMeteorologicos', datos)
          }
          if (infoDataJson && infoDataJson.command === 'estadoGeneralNodos') {
            const nodos = await nodosStore.all()
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

            console.info('Emitiendo estado del nodo: %j', datos)
            socket.emit('getStateNodo', datos)
          }
          if (infoDataJson && infoDataJson.command === 'rtaScan' && infoDataJson['nodos']) {
            const datos: number[] = infoDataJson.nodos
            console.info('Emitiendo datos escaneo: %j', datos)
            socket.emit('rtaScan', datos)
          }
        }
      })
    }
  })

  httpServer.listen(3000)
} catch (e) {
  console.error(e)
}
