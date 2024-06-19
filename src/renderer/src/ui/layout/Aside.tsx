import clsx from 'clsx'
import { useToggle } from '../hooks/useToggle'
import { ItemMenu } from './interfaces/item-menu.interface'
import { ItemMenuAside } from './ItemMenuAside'
import { useEffect, useState } from 'react'
import { Modal } from '../components/modal/Modal'
import { Dialog, DialogType } from '../components/dialog/Dialog'
import { useModal } from '../components/modal/hooks/UseModal'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import { Socket, io } from 'socket.io-client'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://127.0.0.1:3000')

export function Aside(): JSX.Element {
  const { getStateToggle } = useToggle()
  const { getStateModal, addModal, toggleOpenedState } = useModal()

  const [data, setData] = useState<ItemMenu[]>()

  const fetchData = async (): Promise<void> => {
    const result = await window.api.invoke.getItemsMenuAsync()
    setData(result)
  }

  useEffect(() => {
    fetchData()
    addModal('apagar')
    addModal('apagando')
  }, [])

  const openModal = (idModal: string): void => {
    if (getStateModal(idModal)) return
    toggleOpenedState(idModal)
  }

  const items = data?.map(function (item, i) {
    return (
      <li key={i}>
        <ItemMenuAside itemMenu={item} />
      </li>
    )
  })

  const modalClosed = (idModal: string, acept: boolean): void => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
      if (idModal === 'apagar') {
        openModal('apagando')
        socket.emit('stopJob')

        socket.on('getStateNodo', (nodos) => {
          if (nodos) {
            const resp = nodos.every(
              (n) => n.deshabilitado || n.aspersores.every((a) => a.rpm === 0)
            )
            if (resp) {
              if (getStateModal(idModal)) toggleOpenedState('apagando')
              window.api.invoke.apagarDispositivo()
            }
          } else {
            if (getStateModal(idModal)) toggleOpenedState('apagando')
            window.api.invoke.apagarDispositivo()
          }
        })

        setTimeout(() => {
          if (getStateModal(idModal)) toggleOpenedState('apagando')
          window.api.invoke.apagarDispositivo()
        }, 5000)
      }
    }
  }

  return (
    <>
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 mt-[80px] w-[277px] h-screen transition-transform bg-success rounded-r-lg dark:bg-success flex flex-col justify-between',
          {
            '-translate-x-full': !getStateToggle('menu-lateral')
          }
        )}
      >
        <div className="mt-[50px] ml-[15px] mr-[21px] h-[680px] flex flex-col">
          <ul className="flex flex-col pb-6 mb-28">{items}</ul>
          <div
            key={-2}
            onClick={() => openModal('apagar')}
            className="mt-auto border-t-gray-800 border-t-2 pt-6"
          >
            <ItemMenuAside
              itemMenu={{
                icon: '<svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.99997 0.441176C10.6497 0.441176 11.1764 1.03374 11.1764 1.7647V6.17647C11.1764 6.90743 10.6497 7.5 9.99997 7.5C9.35023 7.5 8.8235 6.90743 8.8235 6.17647V1.7647C8.8235 1.03374 9.35019 0.441176 9.99997 0.441176Z" fill="#1C2E3D"/><path d="M13.1778 4.81948C13.1711 5.25129 13.4018 5.65561 13.7877 5.88799C17.2147 7.86347 18.2954 12.086 16.2015 15.3192C14.1076 18.5524 9.63206 19.5721 6.20503 17.5966C2.778 15.6211 1.69729 11.3986 3.79121 8.16532C4.38951 7.24148 5.21107 6.46432 6.18871 5.8974C6.58117 5.66501 6.81815 5.25744 6.815 4.82028C6.81709 4.10985 6.20835 3.53236 5.45534 3.53039C5.19671 3.5297 4.9432 3.59844 4.72441 3.72861C0.0334977 6.47755 -1.4072 12.2936 1.50645 16.7193C4.4201 21.1449 10.5848 22.5041 15.2756 19.7552C19.9665 17.0063 21.4072 11.1902 18.4935 6.7646C17.6825 5.53272 16.5814 4.49383 15.2756 3.72865C14.6366 3.34833 13.7919 3.52874 13.3887 4.1316C13.251 4.33749 13.1779 4.57599 13.1778 4.81948Z" fill="#1C2E3D"/></svg>',
                title: 'Apagar',
                link: ''
              }}
            />
          </div>
        </div>
      </aside>
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
        idModal="apagar"
        ModalContent={Dialog}
        modalContentProps={{
          title: 'Apagar equipo',
          message: '¿Confirma apagar el equipo?',
          type: 'warning',
          buttons: {
            aceptar: {
              text: 'Confirmar',
              noShow: false,
              type: 'success'
            }
          }
        }}
        closed={modalClosed}
        crossClose
        outsideClose
      />
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
        idModal="apagando"
        ModalContent={Dialog}
        modalContentProps={{
          title: 'Apagando...',
          message: 'El equipo se apagara en unos segundos, espere!',
          type: 'warning',
          buttons: {
            aceptar: {
              text: 'Confirmar',
              noShow: true,
              type: 'success'
            },
            cancelar: {
              text: '',
              noShow: true,
              type: 'error'
            }
          }
        }}
        closed={modalClosed}
        crossClose
        outsideClose
      />
    </>
  )
}
