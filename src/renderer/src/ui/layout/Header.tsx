import { useEffect, useRef, useState } from 'react'
import { useTitle } from '../../lib/hooks/UseTitle'
import { ButtonMenu } from './ButtonMenu'
import { useFormInitial } from '../../app/home/components/form-initial/hooks/UseFormInitial'
import { useCarga } from './hooks/useCarga'
import { useToggle } from '../hooks/useToggle'
import { DatosMeteorologicos } from '@renderer/app/home/interfaces/datos-meteorologicos.interface'
import { io, Socket } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import clsx from 'clsx'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://127.0.0.1:3000')

export function Header(): JSX.Element {
  const { title } = useTitle()
  const [dayCurrent, setDayCurrent] = useState('')
  const { cargando } = useCarga()
  const { addToggle, toggleOpenedState, getStateToggle } = useToggle()
  const { operario, isValid } = useFormInitial()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosMeteorologicos>()

  useEffect(() => {
    setDayCurrent(getCurrentDate())
    socket.on('getDatosMeteorologicos', (res) => setDatosMeteorologicos(res))
  }, [dayCurrent])

  const getCurrentDate = (): string => {
    // Days array
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

    const newDate = new Date()
    const date = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()
    const hours = newDate.getHours()
    const mins = newDate.getMinutes()
    const dayCurrent = newDate.getDay()

    return `${days[dayCurrent]} ${date}/${
      month < 10 ? `0${month}` : `${month}`
    }/${year} - ${hours}:${mins} hs.`
  }

  useEffect(() => {
    addToggle('info-login')

    const closeClick = (e: Event): void => {
      // llamo para cerrar
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (e && e.target && buttonRef.current?.contains(e.target)) {
        return
      }
      if (getStateToggle('info-login')) toggleOpenedState('info-login')
    }

    window.addEventListener('click', closeClick)

    return () => {
      window.removeEventListener('click', closeClick)
    }
  }, [])

  const handleInfoLoginClick = (): void => {
    toggleOpenedState('info-login')
  }

  return (
    !cargando && (
      <>
        <ButtonMenu />
        <header className="w-full fixed h-[64px] bg-[#999] dark:bg-dark z-10 pl-[112px] pr-[96px] flex items-center justify-between">
          <h1 className="text-black dark:text-light font-roboto text-base not-italic">{title}</h1>
          <div className="flex gap-2 items-center text-dark dark:text-light">
            <span className="mr-[21px] font-roboto text-sm text-success font-bold not-italic dark:font-normal">
              {operario.name}
            </span>
            <span className="mr-[21px] font-roboto text-sm text-black dark:text-light not-italic font-normal">
              {dayCurrent}
            </span>
            <div className="flex">
              <svg
                width="34"
                height="28"
                viewBox="0 0 28 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.49705 1.92836C6.01472 1.41084 6.71675 1.12012 7.44874 1.12012C8.18074 1.12012 8.88276 1.41084 9.40044 1.92836L17.1107 9.63867C17.6283 10.1563 17.9191 10.8585 17.9191 11.5905C17.9191 12.3225 17.6284 13.0245 17.1109 13.5422L13.5414 17.1117C13.0237 17.6292 12.3215 17.9201 11.5895 17.9201C10.8575 17.9201 10.1555 17.6294 9.63784 17.1119L1.92753 9.40156C1.41001 8.88388 1.11914 8.18171 1.11914 7.44972C1.11914 6.71772 1.40987 6.0157 1.92739 5.49802L5.49705 1.92836ZM3.87967 7.44972L11.5895 15.1596L15.1586 11.5905L7.44874 3.88065L3.87967 7.44972Z"
                  fill="#32CF9C"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.58995 10.4901C7.13668 11.0369 7.13668 11.9233 6.58995 12.47L3.3799 15.6801L5.6 17.9002L8.81005 14.6901C9.35678 14.1434 10.2432 14.1434 10.7899 14.6901C11.3367 15.2369 11.3367 16.1233 10.7899 16.67L6.58995 20.87C6.04322 21.4168 5.15678 21.4168 4.61005 20.87L0.410051 16.67C-0.136684 16.1233 -0.136684 15.2369 0.410051 14.6901L4.61005 10.4901C5.15678 9.94339 6.04322 9.94339 6.58995 10.4901Z"
                  fill="#32CF9C"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.6901 0.410051C15.2369 -0.136684 16.1233 -0.136684 16.67 0.410051L20.87 4.61005C21.4168 5.15678 21.4168 6.04322 20.87 6.58995L16.67 10.7899C16.1233 11.3367 15.2369 11.3367 14.6901 10.7899C14.1434 10.2432 14.1434 9.35678 14.6901 8.81005L17.9002 5.6L15.6801 3.3799L12.47 6.58995C11.9233 7.13668 11.0369 7.13668 10.4901 6.58995C9.94339 6.04322 9.94339 5.15678 10.4901 4.61005L14.6901 0.410051Z"
                  fill="#32CF9C"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.9999 14C14.6248 13.3752 14.4273 12.1637 15.0522 12.7885L17.4522 15.1885C18.077 15.8134 18.077 16.8264 17.4522 17.4513C16.8273 18.0761 15.8143 18.0761 15.1894 17.4513L12.7894 15.0513C12.1646 14.4264 13.3751 14.6248 13.9999 14Z"
                  fill="#32CF9C"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.9064 15.6799C21.7311 15.6799 22.3997 16.3485 22.3997 17.1733C22.3997 18.5595 21.849 19.8889 20.8688 20.8691C19.8886 21.8493 18.5592 22.3999 17.173 22.3999C16.3483 22.3999 15.6797 21.7313 15.6797 20.9066C15.6797 20.0819 16.3483 19.4133 17.173 19.4133C17.7671 19.4133 18.3369 19.1773 18.7569 18.7572C19.177 18.3371 19.413 17.7673 19.413 17.1733C19.413 16.3485 20.0816 15.6799 20.9064 15.6799Z"
                  fill="#32CF9C"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.6008 16.8C27.374 16.8 28.0008 17.4269 28.0008 18.2C28.0008 20.7992 26.9683 23.2918 25.1304 25.1297C23.2926 26.9676 20.7999 28 18.2008 28C17.4276 28 16.8008 27.3732 16.8008 26.6C16.8008 25.8268 17.4276 25.2 18.2008 25.2C20.0573 25.2 21.8378 24.4626 23.1505 23.1498C24.4633 21.837 25.2008 20.0566 25.2008 18.2C25.2008 17.4269 25.8276 16.8 26.6008 16.8Z"
                  fill="#32CF9C"
                />
              </svg>

              <svg
                className={clsx('', {
                  hidden:
                    datosMeteorologicos &&
                    datosMeteorologicos.gpsInfo &&
                    datosMeteorologicos.gpsInfo.nroSatelites
                })}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12.5H4C4.82843 12.5 5.5 13.1716 5.5 14V23.5H0.5V14C0.5 13.1716 1.17157 12.5 2 12.5Z"
                  stroke="#32CF9C"
                />
                <path
                  d="M11 6.5H13C13.8284 6.5 14.5 7.17157 14.5 8V23.5H9.5V8C9.5 7.17157 10.1716 6.5 11 6.5Z"
                  stroke="#32CF9C"
                />
                <path
                  d="M20 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V23.5H18.5V2C18.5 1.17157 19.1716 0.5 20 0.5Z"
                  stroke="#32CF9C"
                />
              </svg>
              <svg
                className={clsx('', {
                  hidden: !(
                    datosMeteorologicos &&
                    datosMeteorologicos.gpsInfo &&
                    datosMeteorologicos.gpsInfo.nroSatelites &&
                    datosMeteorologicos?.gpsInfo?.nroSatelites < 4
                  )
                })}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12.5H4C4.82843 12.5 5.5 13.1716 5.5 14V23.5H0.5V14C0.5 13.1716 1.17157 12.5 2 12.5Z"
                  stroke="#32CF9C"
                />
                <path
                  d="M11 6.5H13C13.8284 6.5 14.5 7.17157 14.5 8V23.5H9.5V8C9.5 7.17157 10.1716 6.5 11 6.5Z"
                  stroke="#32CF9C"
                />
                <path
                  d="M20 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V23.5H18.5V2C18.5 1.17157 19.1716 0.5 20 0.5Z"
                  stroke="#32CF9C"
                />
              </svg>
              <svg
                width="24"
                height="24"
                className={clsx('', {
                  hidden: !(
                    datosMeteorologicos &&
                    datosMeteorologicos.gpsInfo &&
                    datosMeteorologicos.gpsInfo.nroSatelites &&
                    datosMeteorologicos?.gpsInfo?.nroSatelites === 4
                  )
                })}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 14C0 12.8954 0.895431 12 2 12H4C5.10457 12 6 12.8954 6 14V24H0V14Z"
                  fill="#32CF9C"
                />
                <path
                  d="M11 6.5H13C13.8284 6.5 14.5 7.17157 14.5 8V23.5H9.5V8C9.5 7.17157 10.1716 6.5 11 6.5Z"
                  stroke="#32CF9C"
                />
                <path
                  d="M20 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V23.5H18.5V2C18.5 1.17157 19.1716 0.5 20 0.5Z"
                  stroke="#32CF9C"
                />
              </svg>
              <svg
                width="24"
                height="24"
                className={clsx('', {
                  hidden: !(
                    datosMeteorologicos &&
                    datosMeteorologicos.gpsInfo &&
                    datosMeteorologicos.gpsInfo.nroSatelites &&
                    datosMeteorologicos?.gpsInfo?.nroSatelites > 4 &&
                    datosMeteorologicos?.gpsInfo?.nroSatelites < 10
                  )
                })}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 14C0 12.8954 0.895431 12 2 12H4C5.10457 12 6 12.8954 6 14V24H0V14Z"
                  fill="#32CF9C"
                />
                <path
                  d="M9 8C9 6.89543 9.89543 6 11 6H13C14.1046 6 15 6.89543 15 8V24H9V8Z"
                  fill="#32CF9C"
                />
                <path
                  d="M20 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V23.5H18.5V2C18.5 1.17157 19.1716 0.5 20 0.5Z"
                  stroke="#32CF9C"
                />
              </svg>
              <svg
                width="24"
                height="24"
                className={clsx('', {
                  hidden: !(
                    datosMeteorologicos &&
                    datosMeteorologicos.gpsInfo &&
                    datosMeteorologicos.gpsInfo.nroSatelites &&
                    datosMeteorologicos?.gpsInfo?.nroSatelites >= 10
                  )
                })}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 14C0 12.8954 0.895431 12 2 12H4C5.10457 12 6 12.8954 6 14V24H0V14Z"
                  fill="#32CF9C"
                />
                <path
                  d="M9 8C9 6.89543 9.89543 6 11 6H13C14.1046 6 15 6.89543 15 8V24H9V8Z"
                  fill="#32CF9C"
                />
                <path
                  d="M18 2C18 0.89543 18.8954 0 20 0H22C23.1046 0 24 0.895431 24 2V24H18V2Z"
                  fill="#32CF9C"
                />
              </svg>
            </div>
            <div className="ml-4 relative flex">
              <svg
                width="34"
                height="24"
                viewBox="0 0 34 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6655 20.6667C11.6655 19.3833 12.716 18.3333 14 18.3333C15.284 18.3333 16.3345 19.3833 16.3345 20.6667C16.3345 21.95 15.284 23 14 23C12.716 23 11.6655 21.95 11.6655 20.6667ZM21.4236 15.72C22.1123 15.0317 22.1123 13.9233 21.4236 13.2467C17.3266 9.15167 10.6617 9.15167 6.5647 13.2467C5.87603 13.935 5.87603 15.0433 6.5647 15.72C7.25337 16.3967 8.36225 16.4083 9.03925 15.72C11.7706 12.99 16.2177 12.99 18.9491 15.72C19.2876 16.0583 19.7428 16.2333 20.1864 16.2333C20.6299 16.2333 21.0851 16.0583 21.4236 15.72ZM27.4582 10.2717C28.1586 9.60667 28.1819 8.49833 27.5166 7.79833C27.4115 7.69333 27.3065 7.57667 27.2014 7.47167C23.6764 3.94833 18.9841 2 14 2C9.0159 2 4.32361 3.93667 0.798556 7.46C0.693505 7.565 0.588454 7.68167 0.483402 7.78667C-0.181922 8.48667 -0.158578 9.595 0.541764 10.26C1.24211 10.925 2.35098 10.9017 3.01631 10.2017L3.2731 9.93333C6.1445 7.06333 9.94969 5.48833 14 5.48833C18.0503 5.48833 21.8672 7.06333 24.7386 9.93333L24.9954 10.19C25.3339 10.5517 25.8008 10.7267 26.256 10.7267C26.6879 10.7267 27.1314 10.5633 27.4699 10.2483L27.4582 10.2717Z"
                  fill="#32CF9C"
                />
              </svg>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12.5H4C4.82843 12.5 5.5 13.1716 5.5 14V23.5H0.5V14C0.5 13.1716 1.17157 12.5 2 12.5Z"
                  stroke="#32CF9C"
                />
                <path
                  d="M11 6.5H13C13.8284 6.5 14.5 7.17157 14.5 8V23.5H9.5V8C9.5 7.17157 10.1716 6.5 11 6.5Z"
                  stroke="#32CF9C"
                />
                <path
                  d="M20 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V23.5H18.5V2C18.5 1.17157 19.1716 0.5 20 0.5Z"
                  stroke="#32CF9C"
                />
              </svg>
              <svg
                width="24"
                height="24"
                className="hidden"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 14C0 12.8954 0.895431 12 2 12H4C5.10457 12 6 12.8954 6 14V24H0V14Z"
                  fill="#32CF9C"
                />
                <path
                  d="M11 6.5H13C13.8284 6.5 14.5 7.17157 14.5 8V23.5H9.5V8C9.5 7.17157 10.1716 6.5 11 6.5Z"
                  stroke="#32CF9C"
                />
                <path
                  d="M20 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V23.5H18.5V2C18.5 1.17157 19.1716 0.5 20 0.5Z"
                  stroke="#32CF9C"
                />
              </svg>
              <svg
                width="24"
                height="24"
                className="hidden"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 14C0 12.8954 0.895431 12 2 12H4C5.10457 12 6 12.8954 6 14V24H0V14Z"
                  fill="#32CF9C"
                />
                <path
                  d="M9 8C9 6.89543 9.89543 6 11 6H13C14.1046 6 15 6.89543 15 8V24H9V8Z"
                  fill="#32CF9C"
                />
                <path
                  d="M20 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V23.5H18.5V2C18.5 1.17157 19.1716 0.5 20 0.5Z"
                  stroke="#32CF9C"
                />
              </svg>
              <svg
                width="24"
                className="hidden"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 14C0 12.8954 0.895431 12 2 12H4C5.10457 12 6 12.8954 6 14V24H0V14Z"
                  fill="#32CF9C"
                />
                <path
                  d="M9 8C9 6.89543 9.89543 6 11 6H13C14.1046 6 15 6.89543 15 8V24H9V8Z"
                  fill="#32CF9C"
                />
                <path
                  d="M18 2C18 0.89543 18.8954 0 20 0H22C23.1046 0 24 0.895431 24 2V24H18V2Z"
                  fill="#32CF9C"
                />
              </svg>
            </div>
            <ThemeToggle></ThemeToggle>
            {isValid && (
              <button ref={buttonRef} className="ml-4" onClick={handleInfoLoginClick}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 0C7.168 0 0 7.168 0 16C0 24.832 7.168 32 16 32C24.832 32 32 24.832 32 16C32 7.168 24.832 0 16 0ZM8.112 26.048C8.8 24.608 12.992 23.2 16 23.2C19.008 23.2 23.216 24.608 23.888 26.048C21.712 27.776 18.976 28.8 16 28.8C13.024 28.8 10.288 27.776 8.112 26.048ZM26.176 23.728C23.888 20.944 18.336 20 16 20C13.664 20 8.112 20.944 5.824 23.728C4.192 21.584 3.2 18.912 3.2 16C3.2 8.944 8.944 3.2 16 3.2C23.056 3.2 28.8 8.944 28.8 16C28.8 18.912 27.808 21.584 26.176 23.728ZM16 6.4C12.896 6.4 10.4 8.896 10.4 12C10.4 15.104 12.896 17.6 16 17.6C19.104 17.6 21.6 15.104 21.6 12C21.6 8.896 19.104 6.4 16 6.4ZM16 14.4C14.672 14.4 13.6 13.328 13.6 12C13.6 10.672 14.672 9.6 16 9.6C17.328 9.6 18.4 10.672 18.4 12C18.4 13.328 17.328 14.4 16 14.4Z"
                    fill="#32CF9C"
                  />
                </svg>
              </button>
            )}
          </div>
        </header>
      </>
    )
  )
}

function ThemeToggle(): JSX.Element {
  return (
    <div className="flex flex-col justify-center ml-3  cursor-pointer">
      <input
        type="checkbox"
        name="light-switch"
        className="light-switch sr-only cursor-pointer"
        defaultChecked={!window.api.invoke.isThemeModeDark()}
      />
      <label
        className="relative p-2 cursor-pointer w-[68px] h-[47px] bg-[#2B465D] rounded-lg flex justify-center items-center"
        onClick={() => window.api.invoke.changeModeTheme()}
        htmlFor="light-switch"
      >
        <svg
          className="dark:hidden cursor-pointer"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-slate-300"
            d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"
          />
          <path
            className="fill-slate-400"
            d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"
          />
        </svg>
        <svg
          className="hidden dark:block cursor-pointer"
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.392 9.24389L20.915 7.97964L22.1776 5.45223L23.4402 7.97964L25.9643 9.24389L23.4413 10.5092L22.1787 13.0366L20.915 10.5092L18.392 9.24389ZM24.3771 17.3342C24.0562 17.3342 23.7424 17.4295 23.4755 17.6081C23.2086 17.7866 23.0006 18.0404 22.8778 18.3374C22.755 18.6343 22.7228 18.961 22.7855 19.2762C22.8481 19.5915 23.0026 19.881 23.2296 20.1083C23.4566 20.3355 23.7457 20.4903 24.0605 20.553C24.3753 20.6157 24.7016 20.5835 24.9982 20.4605C25.2947 20.3375 25.5482 20.1293 25.7265 19.862C25.9048 19.5948 26 19.2806 26 18.9592C26 18.5282 25.829 18.1149 25.5247 17.8102C25.2203 17.5054 24.8075 17.3342 24.3771 17.3342ZM18.9676 13.0009C18.6466 13.0009 18.3329 13.0962 18.066 13.2748C17.7991 13.4533 17.5911 13.7071 17.4683 14.004C17.3454 14.301 17.3133 14.6277 17.3759 14.9429C17.4385 15.2581 17.5931 15.5477 17.8201 15.7749C18.047 16.0022 18.3362 16.157 18.651 16.2197C18.9658 16.2824 19.2921 16.2502 19.5886 16.1272C19.8852 16.0042 20.1386 15.7959 20.317 15.5287C20.4953 15.2615 20.5905 14.9473 20.5905 14.6259C20.5905 14.1949 20.4195 13.7816 20.1151 13.4768C19.8108 13.1721 19.398 13.0009 18.9676 13.0009ZM20.3297 23.7194L22.7099 22.0846L20.0787 20.893C17.1024 19.5529 14.099 16.4231 14.099 12.4592C14.099 8.75531 16.9011 5.83898 19.3008 4.4664L21.8044 3.03423L19.2835 1.63348C17.2615 0.509716 14.9765 -0.052863 12.6646 0.0039085C10.3527 0.06068 8.09798 0.734741 6.13344 1.9564C4.1689 3.17806 2.56589 4.90297 1.49016 6.95279C0.414427 9.00262 -0.0949881 11.3029 0.0145839 13.616C0.124156 15.929 0.848738 18.1707 2.11341 20.1093C3.37809 22.048 5.13696 23.6132 7.20816 24.6432C9.27936 25.6732 11.5877 26.1305 13.8946 25.9679C16.2014 25.8053 18.423 25.0298 20.3297 23.7194ZM15.1463 3.48815C13.8383 4.59483 12.7794 5.96656 12.0394 7.51289C11.2994 9.05923 10.8952 10.745 10.8533 12.4592C10.9087 14.3836 11.4079 16.269 12.3118 17.9681C13.2157 19.6672 14.4998 21.1339 16.0637 22.2536C15.0817 22.5832 14.0528 22.7511 13.0171 22.7509C10.4346 22.7509 7.95794 21.7237 6.13187 19.8952C4.30579 18.0667 3.27991 15.5868 3.27991 13.0009C3.27991 10.415 4.30579 7.93508 6.13187 6.1066C7.95794 4.27812 10.4346 3.2509 13.0171 3.2509C13.7335 3.24983 14.4477 3.32941 15.1463 3.48815Z"
            fill="#32CF9C"
          />
        </svg>

        <span className="sr-only">Switch to light / dark version</span>
      </label>
    </div>
  )
}
