import { useEffect, useState } from 'react'
import { ItemInfoData } from '../interfaces/item-info.interface'
import { DatosMeteorologicos } from '../interfaces/datos-meteorologicos.interface'
import { DatosSocket } from '../interfaces/datos-socket.interface'

interface Props {
  data: ItemInfoData
}

export function ItemInfo({ data }: Props): JSX.Element {
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosSocket<DatosMeteorologicos>>()

  const fetchDatosMeteorologicos = async (): Promise<void> => {
    const result = await window.api.invoke.getDatosMeteorologicosAsync()
    setDatosMeteorologicos(result)
  }

  const showData = (): string => {
    let resp = ''
    switch (data.title) {
      case 'Humedad':
        resp =
          datosMeteorologicos?.data.humedad !== undefined
            ? datosMeteorologicos?.data.humedad + '%'
            : '-'
        break
      case 'Viento':
        resp =
          datosMeteorologicos?.data.velViento !== undefined
            ? datosMeteorologicos?.data.velViento + 'k/h'
            : '-'
        break
      case 'Temperatura':
        resp =
          datosMeteorologicos?.data.temperatura !== undefined
            ? datosMeteorologicos?.data.temperatura + '°'
            : '-'
        break
      case 'Rocío':
        resp =
          datosMeteorologicos?.data.puntoDeRocio !== undefined
            ? datosMeteorologicos?.data.puntoDeRocio + '°'
            : '-'
        break
    }
    return resp
  }

  useEffect(() => {
    fetchDatosMeteorologicos()
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
