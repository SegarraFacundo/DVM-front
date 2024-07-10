import { ReactNode, useEffect, useRef, useState } from 'react'
import { Header } from './Header'
import { Aside } from './Aside'
import clsx from 'clsx'
import { useToggle } from '../hooks/useToggle'
import { useCarga } from './hooks/useCarga'
import { InfoLogin } from './InfoLogin'
import { useFormInitial } from '@renderer/app/home/components/form-initial/hooks/UseFormInitial'
import { useNavigate } from 'react-router-dom'
import { DatosMeteorologicos } from '@renderer/app/home/interfaces/datos-meteorologicos.interface'
import { io, Socket } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import { useModal } from '../components/modal/hooks/UseModal'
import { Dialog, DialogType } from '../components/dialog/Dialog'
import { Modal } from '../components/modal/Modal'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://127.0.0.1:3000')
interface Props {
  children: ReactNode
}

export function Layout({ children }: Props): JSX.Element {
  const { toggles } = useToggle()
  const { cargando } = useCarga()
  const [opendToggle, setOpendToggle] = useState<boolean>()
  const { isValid } = useFormInitial()
  const navigate = useNavigate()
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosMeteorologicos>()
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const [mostrarMasCartelDeNoDatosMeteorologicos, setMostrarMasCartelDeNoDatosMeteorologicos] =
    useState<boolean>(true)
  const timerId = useRef(null)

  useEffect(() => {
    addModal('sin-datos-meteorologicos')
    navigate('/')
    socket.on('getDatosMeteorologicos', (res) => setDatosMeteorologicos(res))
  }, [])

  useEffect(() => {
    timerId.current = setTimeout(() => {
      if (
        mostrarMasCartelDeNoDatosMeteorologicos &&
        (datosMeteorologicos?.temperatura === undefined ||
          datosMeteorologicos?.temperatura === null) &&
        !getStateModal('sin-datos-meteorologicos')
      )
        toggleOpenedState('sin-datos-meteorologicos')
    }, 5000)

    return () => {
      //Clearing a timeout
      clearTimeout(timerId.current)
    }
  }, [datosMeteorologicos])

  useEffect(() => {
    setOpendToggle(toggles.filter((t) => t.isOpen).length > 0)
  }, [toggles])

  const modalClosed = (idModal: string, acept: boolean): void => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
      if (idModal === 'sin-datos-meteorologicos') setMostrarMasCartelDeNoDatosMeteorologicos(false)
    }
  }
  return (
    <>
      <Header />
      <Aside />
      <Modal<{
        title: string
        message: string
        type: 'success' | 'warning' | 'error' | 'default'
        buttons?: {
          cancelar?: {
            noShow: boolean
            text: string
            type: DialogType
          }
          aceptar?: {
            noShow: boolean
            text: string
            type: DialogType
          }
        }
      }>
        idModal="sin-datos-meteorologicos"
        ModalContent={Dialog}
        modalContentProps={{
          title: 'Estación Meteorológica Inactiva',
          message:
            'Actualmente, la estación meteorológica no está funcionando.<br /> Por favor, verifique la conexión.',
          type: 'warning',
          buttons: {
            cancelar: {
              noShow: true,
              text: '',
              type: 'error'
            }
          }
        }}
        closed={modalClosed}
        crossClose
        outsideClose
      />
      {isValid && <InfoLogin />}
      <div
        className={clsx('w-full h-full opacity-50 fixed top-0 left-0 z-10 bg-black', {
          hidden: !opendToggle
        })}
      />
      {!cargando ? (
        <main
          hidden={cargando}
          className="w-[1280px] h-[800px] relative bg-light dark:bg-[#172530] pt-[64px]"
        >
          {children}
        </main>
      ) : (
        <div className="flex flex-col gap-2 bg-[#EBEBEB] dark:bg-[#172530] w-[1280px] h-[800px] items-center justify-center">
          <div className="animate-[spin_20s_linear_infinite]">
            <svg
              width="60"
              height="65"
              viewBox="0 0 60 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.68907 52.2104C2.49327 49.7896 1.29263 47.3736 0.0968347 44.9527C-0.164595 44.4207 0.125882 43.7813 0.697154 43.6349L11.285 40.931C12.6503 40.5796 13.7928 39.3691 14.1269 37.9195C14.5916 35.9038 13.2554 34.2199 12.4227 33.3951L4.42494 25.3125C4.42494 25.3125 4.40074 25.2881 4.39105 25.2784C3.61645 24.5853 2.01398 22.9307 1.65089 20.4318C1.28295 17.9084 2.37224 15.839 3.19041 14.282C3.60192 13.4962 4.04248 12.8373 4.43947 12.3053C4.78804 11.8416 5.46582 11.8124 5.85312 12.2419L20.9192 28.8267L20.9967 28.8999C21.7325 29.6076 25.4119 33.4634 24.8019 39.1153C24.3323 43.508 21.4517 47.3297 17.2737 49.1209C17.235 49.1355 17.1914 49.1502 17.1527 49.1648L4.76867 52.6887C4.34264 52.8107 3.88756 52.6106 3.69391 52.2104"
                fill="#32CF9C"
              />
              <path
                d="M25.37 0C28.0926 0.198971 30.8103 0.397942 33.533 0.591939C34.1287 0.636708 34.5373 1.22367 34.365 1.80566L31.2239 12.57C30.8202 13.9578 31.2781 15.5944 32.3661 16.6489C33.8776 18.1064 36.0291 17.8029 37.1763 17.4896L48.3326 14.6194C48.3326 14.6194 48.3671 14.6095 48.3819 14.6045C49.3862 14.2812 51.651 13.724 54.0093 14.699C56.3873 15.6839 57.6231 17.7234 58.5486 19.2554C59.0164 20.0264 59.361 20.7577 59.617 21.3844C59.8386 21.9316 59.5136 22.5484 58.9376 22.6678L36.7332 27.3735L36.6298 27.4033C35.6352 27.6868 30.382 28.9354 25.7885 25.4633C22.219 22.7673 20.3925 18.2307 21.0079 13.6096C21.0128 13.5649 21.0227 13.5251 21.0325 13.4803L24.3952 0.706347C24.5084 0.268611 24.922 -0.0298457 25.37 0.00497428"
                fill="#32CF9C"
              />
              <path
                d="M58.539 45.2684C57.0695 47.4962 55.595 49.7193 54.1255 51.9471C53.8022 52.4347 53.0968 52.5064 52.6804 52.0953L44.882 44.4557C43.8778 43.4709 42.2417 43.1028 40.8162 43.5474C38.8372 44.1593 38.0682 46.1337 37.789 47.2572L34.938 58.0855C34.938 58.0855 34.9282 58.1189 34.9282 58.1333C34.7323 59.1372 34.1298 61.3268 32.1606 62.8805C30.1718 64.4534 27.8254 64.5633 26.057 64.6446C25.1655 64.6876 24.3719 64.6446 23.7058 64.5729C23.1277 64.5107 22.7505 63.9466 22.922 63.4016L29.4615 42.314L29.486 42.2136C29.7162 41.2335 31.1466 36.1851 36.339 33.876C40.3754 32.0833 45.1612 32.6187 48.8645 35.272C48.8988 35.2959 48.9331 35.3246 48.9673 35.3533L58.4019 44.1067C58.7252 44.4079 58.7888 44.8908 58.5439 45.2589"
                fill="#32CF9C"
              />
            </svg>
          </div>
          <p className="text-black dark:text-light">cargando...</p>
        </div>
      )}
    </>
  )
}
