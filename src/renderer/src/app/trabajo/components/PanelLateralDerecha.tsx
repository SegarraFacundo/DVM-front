import clsx from 'clsx'
import { useToggle } from '../../../ui/hooks/useToggle'
import { useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import { DatosMeteorologicos } from '@renderer/app/home/interfaces/datos-meteorologicos.interface'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('/')

export function PanelLateralDerecha() {
  const { getStateToggle, addToggle, toggleOpenedState } = useToggle()
  const divContenidoRef = useRef<HTMLDivElement>(null)
  const divPestaniaRef = useRef<HTMLDivElement>(null)
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosMeteorologicos>()

  useEffect(() => {
    addToggle('panel-lateral-derecha')

    socket.on('getDatosMeteorologicos', (res) => setDatosMeteorologicos(res))

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
            '-translate-x-[412px]': getStateToggle('panel-lateral-derecha')
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
          'w-[412px] h-[489px] fixed z-40 right-0 top-[50%] translate-y-[-50%] bg-dark rounded-l-lg flex  justify-center flex-col gap-4 p-8 transition-transform',
          {
            'translate-x-[412px]': !getStateToggle('panel-lateral-derecha')
          }
        )}
      >
        <div className="border-[1px] border-white w-full h-[122px] rounded-lg p-3 flex flex-col">
          <p className="text-success text-[16px] font-bold">Temperatura</p>
          <div className="text-white font-bold flex justify-center align-baseline gap-8 items-end">
            <svg
              width="58"
              height="58"
              viewBox="0 0 58 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.75 36.25C21.75 37.584 20.6673 38.6667 19.3333 38.6667C17.9993 38.6667 16.9167 37.584 16.9167 36.25C16.9167 34.916 17.9993 33.8333 19.3333 33.8333C20.6673 33.8333 21.75 34.916 21.75 36.25ZM26.5833 43.5C25.2493 43.5 24.1667 44.5827 24.1667 45.9167C24.1667 47.2507 25.2493 48.3333 26.5833 48.3333C27.9173 48.3333 29 47.2507 29 45.9167C29 44.5827 27.9173 43.5 26.5833 43.5ZM24.1667 53.1667C22.8327 53.1667 21.75 54.2493 21.75 55.5833C21.75 56.9173 22.8327 58 24.1667 58C25.5007 58 26.5833 56.9173 26.5833 55.5833C26.5833 54.2493 25.5007 53.1667 24.1667 53.1667ZM16.9167 43.5C15.5827 43.5 14.5 44.5827 14.5 45.9167C14.5 47.2507 15.5827 48.3333 16.9167 48.3333C18.2507 48.3333 19.3333 47.2507 19.3333 45.9167C19.3333 44.5827 18.2507 43.5 16.9167 43.5ZM14.5 53.1667C13.166 53.1667 12.0833 54.2493 12.0833 55.5833C12.0833 56.9173 13.166 58 14.5 58C15.834 58 16.9167 56.9173 16.9167 55.5833C16.9167 54.2493 15.834 53.1667 14.5 53.1667ZM38.6667 33.8333C37.3327 33.8333 36.25 34.916 36.25 36.25C36.25 37.584 37.3327 38.6667 38.6667 38.6667C40.0007 38.6667 41.0833 37.584 41.0833 36.25C41.0833 34.916 40.0007 33.8333 38.6667 33.8333ZM36.25 43.5C34.916 43.5 33.8333 44.5827 33.8333 45.9167C33.8333 47.2507 34.916 48.3333 36.25 48.3333C37.584 48.3333 38.6667 47.2507 38.6667 45.9167C38.6667 44.5827 37.584 43.5 36.25 43.5ZM29 33.8333C27.666 33.8333 26.5833 34.916 26.5833 36.25C26.5833 37.584 27.666 38.6667 29 38.6667C30.334 38.6667 31.4167 37.584 31.4167 36.25C31.4167 34.916 30.334 33.8333 29 33.8333ZM41.0882 12.1389C38.3525 4.843 31.4143 0 23.5625 0C13.2361 0 4.83333 8.40275 4.83333 18.7292C4.83333 20.5731 5.11367 22.4097 5.66708 24.2053C2.10008 26.7017 0 30.6844 0 35.0417C0 41.2235 4.2485 46.4193 9.976 47.8983C9.79475 47.2652 9.66667 46.6078 9.66667 45.9167C9.66667 45.6943 9.71258 45.4865 9.73192 45.269C5.48825 43.7852 2.41667 39.7856 2.41667 35.0417C2.41667 31.2161 4.40317 27.7409 7.73333 25.7448L8.58883 25.2324L8.24808 24.2948C7.58833 22.4774 7.25242 20.6045 7.25242 18.7268C7.25242 9.73192 14.5701 2.41425 23.5649 2.41425C30.6482 2.41425 36.8807 6.94308 39.0727 13.6807L39.3385 14.4976L40.1964 14.5145C48.6838 14.6861 55.5858 21.7234 55.5858 30.2059C55.5858 37.6758 50.1531 44.3096 43.4734 45.6194C43.4783 45.7185 43.5024 45.8128 43.5024 45.9143C43.5024 46.6924 43.3478 47.4271 43.1206 48.1279C51.2527 46.9776 58.0024 39.1041 58.0024 30.2059C58.0024 20.7012 50.4914 12.7673 41.0906 12.1365L41.0882 12.1389ZM33.8333 53.1667C32.4993 53.1667 31.4167 54.2493 31.4167 55.5833C31.4167 56.9173 32.4993 58 33.8333 58C35.1673 58 36.25 56.9173 36.25 55.5833C36.25 54.2493 35.1673 53.1667 33.8333 53.1667Z"
                fill="#98E5E1"
              />
            </svg>

            <h1 className="text-[48px]">
              {datosMeteorologicos?.temperatura !== undefined
                ? datosMeteorologicos?.temperatura
                : '-'}
              °<span className="text-[20px]">C</span>
            </h1>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border-[1px] border-white w-full h-[122px] rounded-lg p-3 flex flex-col">
            <p className="text-success text-[16px] font-bold">Rocío</p>
            <div className="text-white font-bold flex justify-center align-baseline">
              <h1 className="text-[48px]">
                {datosMeteorologicos?.puntoDeRocio !== undefined
                  ? datosMeteorologicos?.puntoDeRocio
                  : '-'}
              </h1>
            </div>
          </div>
          <div className="border-[1px] border-white w-full h-[122px] rounded-lg p-3 flex flex-col">
            <p className="text-success text-[16px] font-bold">Viento</p>
            <div className="text-white font-bold flex justify-center align-baseline">
              <h1 className="text-[48px]">
                {datosMeteorologicos?.velViento !== undefined
                  ? datosMeteorologicos?.velViento
                  : '-'}
                <span className="text-[20px]">Km/h</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border-[1px] border-white w-full h-[122px] rounded-lg p-3 flex flex-col">
            <p className="text-success text-[16px] font-bold">Humedad</p>
            <div className="text-white font-bold flex justify-center align-baseline">
              <h1 className="text-[48px]">
                {datosMeteorologicos?.humedad !== undefined ? datosMeteorologicos?.humedad : '-'}
                <span className="text-[20px]">%</span>
              </h1>
            </div>
          </div>
          <div className="border-[1px] border-white w-full h-[122px] rounded-lg p-3 flex flex-col">
            <p className="text-success text-[16px] font-bold">Presión</p>
            <div className="text-white font-bold flex justify-center align-baseline">
              <h1 className="text-[48px]">
                00<span className="text-[20px]">hPa</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
