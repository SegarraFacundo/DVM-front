import { useTitle } from '@renderer/lib/hooks/UseTitle'
import { Button } from '@renderer/ui/components/Button'
import { useEffect, useState } from 'react'
import { DataUnidad } from '../home/interfaces/data-unidad.interface'
import { Modal } from '@renderer/ui/components/modal/Modal'
import { Dialog, DialogType } from '@renderer/ui/components/dialog/Dialog'
import { useModal } from '@renderer/ui/components/modal/hooks/UseModal'
import { io, Socket } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import { useCarga } from '@renderer/ui/layout/hooks/useCarga'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://127.0.0.1:3000')

export default function ConfiguracionGeneral(): JSX.Element {
  const { setTitle } = useTitle()
  const [percentageLoading, setPercentageLoading] = useState<number>(0)
  const [versionFront, setVersionFront] = useState<string>('')
  const [versionBack, setVersionBack] = useState<{
    version: string
    boardVersion: string
  }>({
    version: '',
    boardVersion: ''
  })
  const { setCargando } = useCarga()

  const [mostrarDropDownVelocidad, setMostrarDropDownVelocidad] = useState<boolean>(false)
  const [mostrarDropDownTemperatura, setMostrarDropDownTemperatura] = useState<boolean>(false)
  const [unidades, setUnidades] = useState<DataUnidad[]>([])
  const { getStateModal, addModal, toggleOpenedState } = useModal()

  const fetchBrilloActual = async (): Promise<void> => {
    const brilloActual = await window.api.invoke.getBrilloActual()
    setPercentageLoading(brilloActual > 100 ? 100 : brilloActual < 0 ? 0 : brilloActual)
  }

  const fetchUnidades = async (): Promise<void> => {
    const result = await window.api.invoke.getUnidadesAsync()
    setUnidades(result)
  }

  const getVersiones = async (): Promise<void> => {
    socket.emit('version')
    setVersionFront(await window.api.invoke.getVersionApp())
    socket.on('rtaVersion', (data: { version: string; boardVersion: string }) => {
      setVersionBack(data)
    })
  }

  useEffect(() => {
    setTitle('Configuración General')
    fetchBrilloActual()
    fetchUnidades()
    getVersiones()
    addModal('update-version')
  }, [])
  const handleClickTop = (): void => {
    const porcentaje = percentageLoading >= 100 ? 100 : percentageLoading + 10
    setPercentageLoading(porcentaje > 100 ? 100 : porcentaje < 0 ? 0 : porcentaje)
    window.api.invoke.setBrillo(porcentaje)
  }
  const handleUpdateVersion = (): void => {
    if (getStateModal('update-version')) return
    toggleOpenedState('update-version')
  }
  const handleClickDown = (): void => {
    const porcentaje = percentageLoading <= 0 ? 0 : percentageLoading - 10
    setPercentageLoading(porcentaje > 100 ? 100 : porcentaje < 0 ? 0 : porcentaje)
    window.api.invoke.setBrillo(porcentaje + 10)
  }

  const handleClickDropdown = (input: 'velocidad' | 'temperatura'): void => {
    if (input === 'temperatura') {
      setMostrarDropDownVelocidad(false)
      setMostrarDropDownTemperatura(!mostrarDropDownTemperatura)
    }
    if (input === 'velocidad') {
      setMostrarDropDownVelocidad(!mostrarDropDownVelocidad)
      setMostrarDropDownTemperatura(false)
    }
  }

  const setTemperatura = async (input: 1 | 2): Promise<void> => {
    await window.api.invoke.cambiarUnidadTemperatura(input)
    setMostrarDropDownVelocidad(false)
    setMostrarDropDownTemperatura(false)
    fetchUnidades()
  }

  const setVelocidad = async (input: 1 | 2): Promise<void> => {
    await window.api.invoke.cambiarUnidadVelocidad(input)
    setMostrarDropDownVelocidad(false)
    setMostrarDropDownTemperatura(false)
    fetchUnidades()
  }

  const modalClosed = (idModal: string, acept: boolean): void => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
      if (idModal === 'update-version') {
        setCargando(true)
        window.api.invoke.updateVersion().then((res, rej) => {
          setCargando(false)
          if (!res || rej) {
            alert('Error al actualizar')
          }
        })
      }
    }
  }

  return (
    <article className="w-full flex flex-col content-center justify-around h-[600px] px-20 gap-8">
      <h1 className="text-success mt-12 text-[20px]">Iluminación</h1>
      <section className="flex gap-2 content-center items-center justify-between">
        <Button onClick={handleClickDown} type="success" size="sm" maxWith={false}>
          <small className="text-dark dark:text-light text-[28px]">{'<'}</small>
        </Button>
        <div className="w-full">
          <div className="w-full border-2 border-dark dark:border-light bg-transparent p-1 rounded-md">
            <div
              className="bg-dark dark:bg-light h-2 rounded-sm"
              style={{ width: percentageLoading + '%' }}
            />
          </div>
          <div className="w-full flex justify-end">
            <p className="text-[20px] text-dark dark:text-light font-medium">
              ILUMINACIÓN {percentageLoading}%
            </p>
          </div>
        </div>
        <Button onClick={handleClickTop} type="success" size="sm" maxWith={false}>
          <small className="text-dark dark:text-light text-[28px]">{'>'}</small>
        </Button>
      </section>
      <h1 className="text-success mt-12 text-[20px]">Unidades de medida</h1>
      <div className="flex w-full gap-10">
        <div className="flex">
          <label className="text-dark dark:text-light text-[20px] pr-4 pt-3">Velocidad</label>
          <div className="flex flex-col cursor-pointer">
            <div
              className="bg-white dark:bg-dark w-full flex items-center justify-evenly rounded-[5px] mr-8 p-4 border border-solid border-dark dark:border-light pl-[18px] text-dark dark:text-light"
              onClick={() => handleClickDropdown('velocidad')}
            >
              {unidades.find((u) => u.estaSeleccionada && u.tipo === 'velocidad')?.unidad}
              <svg
                width="16"
                height="9"
                viewBox="0 0 16 9"
                className="fill-current text-dark dark:text-light"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.4225 7.67263L15.6677 2.29759C15.8805 2.07819 16 1.78139 16 1.47202C16 1.16265 15.8805 0.865846 15.6677 0.646438C15.5615 0.536679 15.4351 0.449561 15.2958 0.39011C15.1566 0.330658 15.0072 0.300049 14.8563 0.300049C14.7055 0.300049 14.5561 0.330658 14.4169 0.39011C14.2776 0.449561 14.1512 0.536679 14.045 0.646438L8.81122 6.03319C8.70498 6.14295 8.5786 6.23006 8.43934 6.28952C8.30009 6.34897 8.15072 6.37958 7.99987 6.37958C7.84901 6.37958 7.69965 6.34897 7.56039 6.28952C7.42114 6.23006 7.29475 6.14295 7.18852 6.03319L1.95474 0.646438C1.74107 0.425928 1.45067 0.30143 1.14743 0.300332C0.844186 0.299234 0.552936 0.421626 0.337752 0.640583C0.122569 0.85954 0.00107761 1.15713 5.671e-06 1.46788C-0.00106627 1.77862 0.118372 2.07708 0.33204 2.29759L5.57725 7.67263C6.22004 8.33052 7.09138 8.70005 7.99987 8.70005C8.90835 8.70005 9.77969 8.33052 10.4225 7.67263Z" />
              </svg>
            </div>
            {mostrarDropDownVelocidad && (
              <ul className=" z-30 bg-white dark:bg-dark border-[1px] border-dark dark:border-light rounded-[5px] text-dark dark:text-light mt-2 overflow-y-auto w-full max-h-[140px]">
                <li
                  onClick={() => setVelocidad(1)}
                  key={1}
                  className="p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-300 hover:dark:bg-sky-600 hover:text-dark dark:text-light"
                >
                  Km/h
                </li>
                <li
                  onClick={() => setVelocidad(2)}
                  key={2}
                  className="p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-300 hover:dark:bg-sky-600 hover:text-dark dark:text-light"
                >
                  mi/h
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="flex">
          <label className="text-dark dark:text-light text-[20px] pr-4 pt-3">Temperatura</label>
          <div className="flex flex-col cursor-pointer">
            <div
              className="bg-white dark:bg-dark w-full flex items-center justify-evenly rounded-[5px] mr-8 p-4 border border-solid border-dark dark:border-light pl-[18px] text-dark dark:text-light"
              onClick={() => handleClickDropdown('temperatura')}
            >
              °{unidades.find((u) => u.estaSeleccionada && u.tipo === 'temperatura')?.unidad}
              <svg
                width="16"
                height="9"
                viewBox="0 0 16 9"
                className="fill-current text-dark dark:text-light"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.4225 7.67263L15.6677 2.29759C15.8805 2.07819 16 1.78139 16 1.47202C16 1.16265 15.8805 0.865846 15.6677 0.646438C15.5615 0.536679 15.4351 0.449561 15.2958 0.39011C15.1566 0.330658 15.0072 0.300049 14.8563 0.300049C14.7055 0.300049 14.5561 0.330658 14.4169 0.39011C14.2776 0.449561 14.1512 0.536679 14.045 0.646438L8.81122 6.03319C8.70498 6.14295 8.5786 6.23006 8.43934 6.28952C8.30009 6.34897 8.15072 6.37958 7.99987 6.37958C7.84901 6.37958 7.69965 6.34897 7.56039 6.28952C7.42114 6.23006 7.29475 6.14295 7.18852 6.03319L1.95474 0.646438C1.74107 0.425928 1.45067 0.30143 1.14743 0.300332C0.844186 0.299234 0.552936 0.421626 0.337752 0.640583C0.122569 0.85954 0.00107761 1.15713 5.671e-06 1.46788C-0.00106627 1.77862 0.118372 2.07708 0.33204 2.29759L5.57725 7.67263C6.22004 8.33052 7.09138 8.70005 7.99987 8.70005C8.90835 8.70005 9.77969 8.33052 10.4225 7.67263Z" />
              </svg>
            </div>
            {mostrarDropDownTemperatura && (
              <ul className=" z-30 bg-white dark:bg-dark rounded-[5px] border-[1px] border-dark dark:border-light text-dark dark:text-light mt-2 overflow-y-auto w-full max-h-[140px]">
                <li
                  onClick={() => setTemperatura(1)}
                  key={1}
                  className="p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-300 hover:dark:bg-sky-600 hover:text-dark dark:text-light"
                >
                  °C
                </li>
                <li
                  onClick={() => setTemperatura(2)}
                  key={2}
                  className="p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-300 hover:dark:bg-sky-600 hover:text-dark dark:text-light"
                >
                  °F
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-10 border-2 border-success rounded-lg p-4">
        <div>
          <h1 className="text-success font-bold text-[20px]">Versión</h1>
          <p className="text-white text-[20px]">
            App: v{versionFront}&emsp;Api: {versionBack.version}&emsp;Placa:{' '}
            {versionBack.boardVersion}
          </p>
        </div>
        <div>
          <Button type="success" size="lg" maxWith={false} onClick={handleUpdateVersion}>
            Actualizar versión
          </Button>
        </div>
      </div>
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
        idModal="update-version"
        ModalContent={Dialog}
        modalContentProps={{
          title: 'Actualización de versión',
          message: '¿Desea actualizar la aplicación a la última versión?',
          type: 'warning'
        }}
        closed={modalClosed}
        crossClose
        outsideClose
      />
    </article>
  )
}
