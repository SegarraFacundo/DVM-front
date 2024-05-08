import { useEffect, useState } from 'react'
import { ItemInfoData } from '../interfaces/item-info.interface'
import { DatosMeteorologicos } from '../interfaces/datos-meteorologicos.interface'
import { io, Socket } from 'socket.io-client'

import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import { DataUnidad } from '../interfaces/data-unidad.interface'

interface Props {
  data: ItemInfoData
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('/')

export function ItemInfo({ data }: Props): JSX.Element {
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosMeteorologicos>()
  const [unidades, setUnidades] = useState<DataUnidad[]>([])
  const getData = (): {
    valor: string
    unidad: string
  } => {
    let resp = {
      valor: '',
      unidad: ''
    }
    const unidad =
      unidades.find((u) => u.estaSeleccionada && u.tipo === 'temperatura')?.unidad ?? ''
    switch (data.title) {
      case 'Humedad':
        resp =
          datosMeteorologicos?.humedad !== undefined
            ? { valor: datosMeteorologicos?.humedad?.toString() ?? '', unidad: data.unidad }
            : { valor: '-', unidad: '' }
        break
      case 'Viento':
        resp =
          datosMeteorologicos?.velViento !== undefined
            ? {
                valor: datosMeteorologicos?.velViento?.toString() ?? '',
                unidad:
                  unidades.find((u) => u.estaSeleccionada && u.tipo === 'velocidad')?.unidad ?? ''
              }
            : { valor: '-', unidad: '' }
        break
      case 'Temperatura':
        resp =
          datosMeteorologicos?.temperatura !== undefined
            ? { valor: datosMeteorologicos?.temperatura?.toString() ?? '', unidad: '°' + unidad }
            : { valor: '-', unidad: '' }
        break
      case 'Rocío':
        resp =
          datosMeteorologicos?.puntoDeRocio !== undefined
            ? { valor: datosMeteorologicos?.puntoDeRocio?.toString() ?? '', unidad: '°' + unidad }
            : { valor: '-', unidad: '' }
        break
    }
    return resp
  }

  const fetchData = async () => {
    const result = await window.api.invoke.getUnidadesAsync()
    setUnidades(result)
  }

  useEffect(() => {
    fetchData()
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
      <div className="flex items-baseline gap-2">
        <h1 className="text-white text-[48px] font-bold">{getData().valor}</h1>
        <p className="text-white text-[34px] font-light">{getData().unidad}</p>
      </div>
    </div>
  )
}
