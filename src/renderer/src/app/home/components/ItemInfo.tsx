import { useEffect, useState } from 'react'
import { ItemInfoData } from '../interfaces/item-info.interface'
import { DatosMeteorologicos } from '../interfaces/datos-meteorologicos.interface'
import { io, Socket } from 'socket.io-client'

import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'

interface Props {
  data: ItemInfoData
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('/')

export function ItemInfo({ data }: Props): JSX.Element {
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosMeteorologicos>()

  const showData = (): string => {
    let resp = ''
    switch (data.title) {
      case 'Humedad':
        resp = datosMeteorologicos?.humedad !== undefined ? datosMeteorologicos?.humedad + '%' : '-'
        break
      case 'Viento':
        resp =
          datosMeteorologicos?.velViento !== undefined
            ? datosMeteorologicos?.velViento + 'k/h'
            : '-'
        break
      case 'Temperatura':
        resp =
          datosMeteorologicos?.temperatura !== undefined
            ? datosMeteorologicos?.temperatura + '°'
            : '-'
        break
      case 'Rocío':
        resp =
          datosMeteorologicos?.puntoDeRocio !== undefined
            ? datosMeteorologicos?.puntoDeRocio + '°'
            : '-'
        break
    }
    return resp
  }

  useEffect(() => {
    socket.on('getDatosMeteorologicos', (res) => setDatosMeteorologicos(res))
  }, [])

  return (
    <div className="flex items-center justify-around px-[30px]">
      <img
        className="w-[48px] h-auto mr-5"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(data.icon)}`}
      />
      <div className="w-full">
        <h3 className="text-white text-[32px] font-roboto font-bold">{data.title}</h3>
        <span className="text-success font-roboto text-[13px]">{data.info}</span>
      </div>
      <h1 className="text-white text-[48px] font-bold">{showData()}</h1>
    </div>
  )
}
