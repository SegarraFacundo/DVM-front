import clsx from 'clsx'
import { useToggle } from '../../../ui/hooks/useToggle'
import { useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import { DatosMeteorologicos } from '@renderer/app/home/interfaces/datos-meteorologicos.interface'
import { DataUnidad } from '@renderer/app/home/interfaces/data-unidad.interface'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://127.0.0.1:3000')

export function PanelLateralDerecha() {
  const { getStateToggle, addToggle, toggleOpenedState } = useToggle()
  const divContenidoRef = useRef<HTMLDivElement>(null)
  const divPestaniaRef = useRef<HTMLDivElement>(null)
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosMeteorologicos>()
  const [unidades, setUnidades] = useState<DataUnidad[]>([])

  const fetchUnidades = async () => {
    const result = await window.api.invoke.getUnidadesAsync()
    setUnidades(result)
  }

  useEffect(() => {
    addToggle('panel-lateral-derecha')

    socket.on('getDatosMeteorologicos', (res) => setDatosMeteorologicos(res))
    fetchUnidades()

    const closeClick = (e: Event) => {
      if (
        e.target &&
        (divPestaniaRef.current?.contains(e.target) || divContenidoRef.current?.contains(e.target))
      ) {
        return
      }
      if (getStateToggle('panel-lateral-derecha')) toggleOpenedState('panel-lateral-derecha')
    }

    window.addEventListener('click', closeClick)

    return () => {
      window.removeEventListener('click', closeClick)
    }
  }, [])

  const handleClickPanel = () => {
    toggleOpenedState('panel-lateral-derecha')
  }

  const getPuntoCardinal = (valor: number): string => {
    if (valor > 337.5 || valor <= 22.5) return 'N'
    else if (valor > 22.5 && valor <= 67.5) return 'NE'
    else if (valor > 67.5 && valor <= 112.5) return 'E'
    else if (valor > 112.5 && valor <= 157.5) return 'SE'
    else if (valor > 157.5 && valor <= 202.5) return 'S'
    else if (valor > 202.5 && valor <= 247.5) return 'SO'
    else if (valor > 247.5 && valor <= 292.5) return 'O'
    else if (valor > 292.5 && valor <= 337.5) return 'NO'
    return ''
  }

  const getData = (
    tipo:
      | 'Humedad'
      | 'Velocidad del viento'
      | 'Temperatura'
      | 'Punto de Rocío'
      | 'Dirección del viento'
      | ''
  ): {
    valor: string
    unidad: string
  } => {
    let resp = {
      valor: '',
      unidad: ''
    }
    const unidad =
      unidades.find((u) => u.estaSeleccionada && u.tipo === 'temperatura')?.unidad ?? ''
    switch (tipo) {
      case 'Humedad':
        resp =
          datosMeteorologicos?.humedad !== undefined
            ? { valor: datosMeteorologicos?.humedad?.toString() ?? '', unidad: '%' }
            : { valor: '-- --', unidad: '' }
        break
      case 'Velocidad del viento': {
        const unidadVelocidad =
          unidades.find((u) => u.estaSeleccionada && u.tipo === 'velocidad')?.unidad ?? ''
        resp =
          datosMeteorologicos?.velViento !== undefined && datosMeteorologicos?.velViento != null
            ? {
                valor:
                  (
                    datosMeteorologicos.velViento *
                    3.6 *
                    (unidadVelocidad === 'mi/h' ? 0.621371 : 1)
                  )?.toFixed(0) ?? '', // Constante para pasar de m/s a Km/h
                unidad:
                  unidades.find((u) => u.estaSeleccionada && u.tipo === 'velocidad')?.unidad ?? ''
              }
            : { valor: '-- --', unidad: '' }
        break
      }
      case 'Temperatura': {
        const unidadTemperatura =
          unidades.find((u) => u.estaSeleccionada && u.tipo === 'temperatura')?.unidad ?? ''
        resp =
          datosMeteorologicos?.temperatura !== undefined
            ? {
                valor:
                  (unidadTemperatura === 'F'
                    ? (datosMeteorologicos.temperatura ?? (1 * 9) / 5) + 32
                    : datosMeteorologicos.temperatura
                  )?.toString() ?? '',
                unidad: unidad
              }
            : { valor: '-- --', unidad: '' }
        break
      }
      case 'Punto de Rocío': {
        const unidadTemperatura =
          unidades.find((u) => u.estaSeleccionada && u.tipo === 'temperatura')?.unidad ?? ''
        resp =
          datosMeteorologicos?.puntoDeRocio !== undefined
            ? {
                valor:
                  (unidadTemperatura === 'F'
                    ? (datosMeteorologicos.puntoDeRocio ?? (1 * 9) / 5) + 32
                    : datosMeteorologicos.puntoDeRocio
                  )?.toString() ?? '',
                unidad: unidad
              }
            : { valor: '-- --', unidad: '' }
        break
      }
      case 'Dirección del viento': {
        resp =
          datosMeteorologicos?.dirViento !== undefined
            ? {
                valor: datosMeteorologicos.dirViento?.toString() ?? '',
                unidad:
                  datosMeteorologicos.dirViento != undefined &&
                  datosMeteorologicos.dirViento != null
                    ? `${getPuntoCardinal(datosMeteorologicos.dirViento)}`
                    : ''
              }
            : { valor: '-- --', unidad: '' }
        break
      }
    }
    return resp
  }

  return (
    <>
      {getStateToggle('panel-lateral-derecha') && (
        <div className="fixed z-30 top-0 left-0 w-full h-full bg-black opacity-50"></div>
      )}
      <div
        ref={divPestaniaRef}
        onClick={handleClickPanel}
        className={clsx(
          'fixed z-40 right-0 top-[50%] w-[32px] h-[256px] translate-y-[-50%] bg-success rounded-l-lg flex items-center justify-center transition-transform',
          {
            '-translate-x-[512px]': getStateToggle('panel-lateral-derecha')
          }
        )}
      >
        {getStateToggle('panel-lateral-derecha') ? (
          <svg
            width="12"
            height="21"
            viewBox="0 0 12 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-6.93985e-08 19.4123L-8.48541e-07 1.58765C0.0013109 1.27234 0.0953627 0.964491 0.270262 0.703047C0.445162 0.441601 0.693056 0.238296 0.982595 0.118841C1.27213 -0.000616129 1.59032 -0.0308629 1.89691 0.0319308C2.20351 0.0947246 2.48474 0.247736 2.70505 0.471615L11.5321 9.36802C11.6803 9.51623 11.798 9.69257 11.8783 9.88685C11.9587 10.0811 12 10.2895 12 10.5C12 10.7105 11.9587 10.9189 11.8783 11.1131C11.798 11.3074 11.6803 11.4838 11.5321 11.632L2.70505 20.5284C2.48474 20.7523 2.20351 20.9053 1.89691 20.9681C1.59032 21.0309 1.27214 21.0006 0.982596 20.8812C0.693056 20.7617 0.445163 20.5584 0.270263 20.297C0.0953636 20.0355 0.00131171 19.7277 -6.93985e-08 19.4123Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            width="12"
            height="21"
            viewBox="0 0 12 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1.58765L12 19.4123C11.9987 19.7277 11.9046 20.0355 11.7297 20.297C11.5548 20.5584 11.3069 20.7617 11.0174 20.8812C10.7279 21.0006 10.4097 21.0309 10.1031 20.9681C9.7965 20.9053 9.51526 20.7523 9.29495 20.5284L0.467927 11.632C0.319658 11.4838 0.201973 11.3074 0.121662 11.1131C0.0413515 10.9189 3.90775e-06 10.7105 3.86844e-06 10.5C3.82913e-06 10.2895 0.0413513 10.0811 0.121662 9.88686C0.201973 9.69257 0.319657 9.51624 0.467927 9.36802L9.29495 0.471618C9.51526 0.247738 9.79649 0.094728 10.1031 0.0319347C10.4097 -0.0308587 10.7279 -0.00061536 11.0174 0.118841C11.3069 0.238298 11.5548 0.441603 11.7297 0.703048C11.9046 0.964493 11.9987 1.27234 12 1.58765Z"
              fill="white"
            />
          </svg>
        )}
      </div>
      <div
        ref={divContenidoRef}
        className={clsx(
          'w-[512px] h-[489px] fixed z-40 right-0 top-[50%] translate-y-[-50%] bg-light dark:bg-dark rounded-l-lg flex  justify-center flex-col gap-4 p-8 transition-transform',
          {
            'translate-x-[512px]': !getStateToggle('panel-lateral-derecha')
          }
        )}
      >
        <div className="border-[1px] border-dark dark:border-light w-full h-[122px] rounded-lg p-3 flex flex-col">
          <p className="text-success text-[16px] font-bold">Temperatura</p>

          <div className="text-dark dark:text-light font-bold items-baseline flex justify-center w-full">
            <h1 className="text-[46px] text-right">{getData('Temperatura').valor}</h1>
            <span className="text-[20px] ml-4 w-[60px] inline-block">
              °{getData('Temperatura').unidad}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border-[1px] border-dark dark:border-light w-full h-[122px] rounded-lg p-3 flex flex-col">
            <p className="text-success text-[16px] font-bold">Vel. del viento</p>
            <div className="text-dark dark:text-light font-bold items-baseline flex justify-end w-full">
              <h1 className="text-[46px] text-right">{getData('Velocidad del viento').valor}</h1>
              <span className="text-[20px] ml-4 w-[60px] inline-block">
                {getData('Velocidad del viento').unidad}
              </span>
            </div>
          </div>
          <div className="border-[1px] border-dark dark:border-light w-full h-[122px] rounded-lg p-3 flex flex-col">
            <p className="text-success text-[16px] font-bold">Dir. del viento</p>
            <div className="text-dark dark:text-light font-bold items-baseline flex justify-end w-full">
              <h1 className="text-[46px] text-right">{getData('Dirección del viento').unidad}</h1>
              <span className="text-[20px] ml-4 w-[60px] inline-block">
                {/* {getData('Dirección del viento').unidad} */}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border-[1px] border-dark dark:border-light w-full h-[122px] rounded-lg p-3 flex flex-col">
            <p className="text-success text-[16px] font-bold">Humedad</p>
            <div className="text-dark dark:text-light font-bold items-baseline flex justify-end w-full">
              <h1 className="text-[46px] text-right">{getData('Humedad').valor}</h1>
              <span className="text-[20px] ml-4 w-[60px] inline-block">%</span>
            </div>
          </div>
          <div className=" w-full h-[122px] rounded-lg p-3 flex flex-col"></div>
        </div>
      </div>
    </>
  )
}
