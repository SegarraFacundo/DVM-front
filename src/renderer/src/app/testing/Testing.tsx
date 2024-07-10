import { useEffect, useState } from 'react'
import { useTitle } from '../../lib/hooks/UseTitle'
import { Modal } from '../../ui/components/modal/Modal'
import { Dialog } from '../../ui/components/dialog/Dialog'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../ui/components/modal/hooks/UseModal'
import { Nodo } from '../../ui/components/nodo/Nodo'
import { Button } from '../../ui/components/Button'
import { Socket, io } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://127.0.0.1:3000')

export function Testing(): JSX.Element {
  const { setTitle } = useTitle()
  const [percentageLoading, setPercentageLoading] = useState<number>(0)
  const navigate = useNavigate()
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const [nodos, setNodos] = useState<JSX.Element[]>([])

  useEffect(() => {
    addModal('repetir-testing')

    socket.emit('testing')
    setPercentageLoading(0)

    for (let index = 1; index < 101; index++) {
      setTimeout(() => setPercentageLoading(index), index * 45)
    }

    socket.on('getStateNodo', (nodos) => {
      if (nodos) {
        setNodos(
          nodos.map((nodoData, i) => {
            return <Nodo key={i} posicion={i} data={nodoData} />
          })
        )
      }
    })
    setTitle('Testeo de Aspersores')
  }, [])

  const modalClosed = (_: string, acept: boolean): void => {
    if (acept) {
      socket.emit('testing')
      setPercentageLoading(0)

      for (let index = 1; index < 101; index++) {
        setTimeout(() => setPercentageLoading(index), index * 45)
      }
    }
  }

  const handleRepetirTestingClick = (): void => {
    if (getStateModal('repetir-testing')) return
    toggleOpenedState('repetir-testing')
  }

  const handleIniciarTrabajoClick = (): void => {
    navigate('/trabajo', {
      state: nodos.map((n) => n.props['data'])
    })
  }
  return (
    <article className="w-full flex flex-col content-center justify-around h-[100%] px-20">
      <section className="grid grid-cols-3 gap-4">{nodos}</section>
      <section className="flex flex-col gap-2 content-center items-center justify-between">
        <div className="w-full border-2 border-dark dark:border-light bg-transparent p-1 rounded-md">
          <div
            className="bg-dark dark:bg-light h-2 rounded-sm"
            style={{ width: percentageLoading + '%' }}
          />
        </div>

        <div className="w-full flex justify-end">
          <p className="text-[20px] text-dark dark:text-light font-medium">
            TESTING {percentageLoading}%
          </p>
        </div>
      </section>
      <section className="flex justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <svg
              width="16"
              height="14"
              viewBox="0 0 41 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#32CF9C"
                d="M2.76205 35.0468C1.94208 33.4382 1.11879 31.8329 0.298822 30.2243C0.119558 29.8708 0.318741 29.4459 0.710467 29.3486L7.97069 27.552C8.90685 27.3184 9.6903 26.5142 9.91936 25.551C10.2381 24.2115 9.32181 23.0927 8.75082 22.5446L3.26665 17.174C3.26665 17.174 3.25005 17.1578 3.24341 17.1513C2.71226 16.6908 1.61343 15.5914 1.36445 13.9309C1.11215 12.2542 1.85909 10.8791 2.42012 9.84456C2.7023 9.32242 3.00439 8.8846 3.27661 8.5311C3.51563 8.22301 3.98039 8.20355 4.24597 8.48894L14.5769 19.509L14.63 19.5577C15.1346 20.0279 17.6576 22.59 17.2393 26.3455C16.9173 29.2643 14.9421 31.8037 12.0772 32.9939C12.0506 33.0036 12.0207 33.0133 11.9942 33.0231L3.50235 35.3646C3.21021 35.4457 2.89816 35.3127 2.76537 35.0468"
              />
              <path
                fill="#32CF9C"
                d="M17.5929 0.689697C19.4287 0.819422 21.2612 0.949146 23.097 1.07563C23.4987 1.10482 23.7743 1.4875 23.6581 1.86695L21.5401 8.88504C21.2679 9.78987 21.5766 10.8568 22.3103 11.5444C23.3294 12.4946 24.7801 12.2968 25.5536 12.0925L33.0761 10.2212C33.0761 10.2212 33.0993 10.2147 33.1093 10.2115C33.7865 10.0007 35.3136 9.63744 36.9037 10.2731C38.5072 10.9152 39.3404 12.2449 39.9645 13.2438C40.2799 13.7465 40.5123 14.2232 40.6849 14.6318C40.8343 14.9886 40.6152 15.3907 40.2268 15.4686L25.2548 18.5365L25.1851 18.556C24.5145 18.7409 20.9724 19.5549 17.8751 17.2912C15.4683 15.5334 14.2367 12.5757 14.6517 9.56285C14.655 9.53366 14.6616 9.50772 14.6683 9.47853L16.9356 1.15022C17.012 0.864825 17.2908 0.670239 17.5929 0.69294"
              />
              <path
                fill="#32CF9C"
                d="M39.8749 30.4749C38.8789 31.9862 37.8797 33.4943 36.8838 35.0056C36.6647 35.3364 36.1866 35.385 35.9045 35.1061L30.6195 29.9236C29.9389 29.2555 28.8302 29.0058 27.8641 29.3074C26.523 29.7225 26.0018 31.0619 25.8125 31.8241L23.8805 39.1697C23.8805 39.1697 23.8738 39.1924 23.8738 39.2022C23.741 39.8832 23.3327 41.3685 21.9982 42.4226C20.6504 43.4895 19.0602 43.5641 17.8618 43.6193C17.2576 43.6485 16.7198 43.6193 16.2683 43.5706C15.8766 43.5285 15.621 43.1458 15.7372 42.7761L20.169 28.4707L20.1856 28.4026C20.3416 27.7378 21.311 24.313 24.8299 22.7466C27.5653 21.5304 30.8087 21.8937 33.3184 23.6936C33.3417 23.7098 33.3649 23.7293 33.3881 23.7487L39.7819 29.6869C40.001 29.8912 40.0442 30.2187 39.8782 30.4685"
              />
            </svg>
            <p className="text-dark dark:text-light text-[12px]">Funcionamiento regular</p>
          </div>
          <div className="flex gap-2 items-center">
            <svg
              width="16"
              height="14"
              viewBox="0 0 41 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#DC3545"
                d="M2.76205 35.0468C1.94208 33.4382 1.11879 31.8329 0.298822 30.2243C0.119558 29.8708 0.318741 29.4459 0.710467 29.3486L7.97069 27.552C8.90685 27.3184 9.6903 26.5142 9.91936 25.551C10.2381 24.2115 9.32181 23.0927 8.75082 22.5446L3.26665 17.174C3.26665 17.174 3.25005 17.1578 3.24341 17.1513C2.71226 16.6908 1.61343 15.5914 1.36445 13.9309C1.11215 12.2542 1.85909 10.8791 2.42012 9.84456C2.7023 9.32242 3.00439 8.8846 3.27661 8.5311C3.51563 8.22301 3.98039 8.20355 4.24597 8.48894L14.5769 19.509L14.63 19.5577C15.1346 20.0279 17.6576 22.59 17.2393 26.3455C16.9173 29.2643 14.9421 31.8037 12.0772 32.9939C12.0506 33.0036 12.0207 33.0133 11.9942 33.0231L3.50235 35.3646C3.21021 35.4457 2.89816 35.3127 2.76537 35.0468"
              />
              <path
                fill="#DC3545"
                d="M17.5929 0.689697C19.4287 0.819422 21.2612 0.949146 23.097 1.07563C23.4987 1.10482 23.7743 1.4875 23.6581 1.86695L21.5401 8.88504C21.2679 9.78987 21.5766 10.8568 22.3103 11.5444C23.3294 12.4946 24.7801 12.2968 25.5536 12.0925L33.0761 10.2212C33.0761 10.2212 33.0993 10.2147 33.1093 10.2115C33.7865 10.0007 35.3136 9.63744 36.9037 10.2731C38.5072 10.9152 39.3404 12.2449 39.9645 13.2438C40.2799 13.7465 40.5123 14.2232 40.6849 14.6318C40.8343 14.9886 40.6152 15.3907 40.2268 15.4686L25.2548 18.5365L25.1851 18.556C24.5145 18.7409 20.9724 19.5549 17.8751 17.2912C15.4683 15.5334 14.2367 12.5757 14.6517 9.56285C14.655 9.53366 14.6616 9.50772 14.6683 9.47853L16.9356 1.15022C17.012 0.864825 17.2908 0.670239 17.5929 0.69294"
              />
              <path
                fill="#DC3545"
                d="M39.8749 30.4749C38.8789 31.9862 37.8797 33.4943 36.8838 35.0056C36.6647 35.3364 36.1866 35.385 35.9045 35.1061L30.6195 29.9236C29.9389 29.2555 28.8302 29.0058 27.8641 29.3074C26.523 29.7225 26.0018 31.0619 25.8125 31.8241L23.8805 39.1697C23.8805 39.1697 23.8738 39.1924 23.8738 39.2022C23.741 39.8832 23.3327 41.3685 21.9982 42.4226C20.6504 43.4895 19.0602 43.5641 17.8618 43.6193C17.2576 43.6485 16.7198 43.6193 16.2683 43.5706C15.8766 43.5285 15.621 43.1458 15.7372 42.7761L20.169 28.4707L20.1856 28.4026C20.3416 27.7378 21.311 24.313 24.8299 22.7466C27.5653 21.5304 30.8087 21.8937 33.3184 23.6936C33.3417 23.7098 33.3649 23.7293 33.3881 23.7487L39.7819 29.6869C40.001 29.8912 40.0442 30.2187 39.8782 30.4685"
              />
            </svg>
            <p className="text-dark dark:text-light text-[12px]">Sin funcionamiento</p>
          </div>
          <div className="flex gap-2 items-center">
            <svg
              width="16"
              height="14"
              viewBox="0 0 41 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#696767"
                d="M2.76205 35.0468C1.94208 33.4382 1.11879 31.8329 0.298822 30.2243C0.119558 29.8708 0.318741 29.4459 0.710467 29.3486L7.97069 27.552C8.90685 27.3184 9.6903 26.5142 9.91936 25.551C10.2381 24.2115 9.32181 23.0927 8.75082 22.5446L3.26665 17.174C3.26665 17.174 3.25005 17.1578 3.24341 17.1513C2.71226 16.6908 1.61343 15.5914 1.36445 13.9309C1.11215 12.2542 1.85909 10.8791 2.42012 9.84456C2.7023 9.32242 3.00439 8.8846 3.27661 8.5311C3.51563 8.22301 3.98039 8.20355 4.24597 8.48894L14.5769 19.509L14.63 19.5577C15.1346 20.0279 17.6576 22.59 17.2393 26.3455C16.9173 29.2643 14.9421 31.8037 12.0772 32.9939C12.0506 33.0036 12.0207 33.0133 11.9942 33.0231L3.50235 35.3646C3.21021 35.4457 2.89816 35.3127 2.76537 35.0468"
              />
              <path
                fill="#696767"
                d="M17.5929 0.689697C19.4287 0.819422 21.2612 0.949146 23.097 1.07563C23.4987 1.10482 23.7743 1.4875 23.6581 1.86695L21.5401 8.88504C21.2679 9.78987 21.5766 10.8568 22.3103 11.5444C23.3294 12.4946 24.7801 12.2968 25.5536 12.0925L33.0761 10.2212C33.0761 10.2212 33.0993 10.2147 33.1093 10.2115C33.7865 10.0007 35.3136 9.63744 36.9037 10.2731C38.5072 10.9152 39.3404 12.2449 39.9645 13.2438C40.2799 13.7465 40.5123 14.2232 40.6849 14.6318C40.8343 14.9886 40.6152 15.3907 40.2268 15.4686L25.2548 18.5365L25.1851 18.556C24.5145 18.7409 20.9724 19.5549 17.8751 17.2912C15.4683 15.5334 14.2367 12.5757 14.6517 9.56285C14.655 9.53366 14.6616 9.50772 14.6683 9.47853L16.9356 1.15022C17.012 0.864825 17.2908 0.670239 17.5929 0.69294"
              />
              <path
                fill="#696767"
                d="M39.8749 30.4749C38.8789 31.9862 37.8797 33.4943 36.8838 35.0056C36.6647 35.3364 36.1866 35.385 35.9045 35.1061L30.6195 29.9236C29.9389 29.2555 28.8302 29.0058 27.8641 29.3074C26.523 29.7225 26.0018 31.0619 25.8125 31.8241L23.8805 39.1697C23.8805 39.1697 23.8738 39.1924 23.8738 39.2022C23.741 39.8832 23.3327 41.3685 21.9982 42.4226C20.6504 43.4895 19.0602 43.5641 17.8618 43.6193C17.2576 43.6485 16.7198 43.6193 16.2683 43.5706C15.8766 43.5285 15.621 43.1458 15.7372 42.7761L20.169 28.4707L20.1856 28.4026C20.3416 27.7378 21.311 24.313 24.8299 22.7466C27.5653 21.5304 30.8087 21.8937 33.3184 23.6936C33.3417 23.7098 33.3649 23.7293 33.3881 23.7487L39.7819 29.6869C40.001 29.8912 40.0442 30.2187 39.8782 30.4685"
              />
            </svg>
            <p className="text-dark dark:text-light text-[12px]">Desconectado</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleRepetirTestingClick} type="default-light">
            Repetir Test
          </Button>
          <Modal<{
            title: string
            message: string
            type: 'success' | 'warning' | 'error' | 'default'
          }>
            idModal="repetir-testing"
            ModalContent={Dialog}
            modalContentProps={{
              title: 'Repetir test',
              message: '¿Desea repetir el test de los aspersores?',
              type: 'warning'
            }}
            closed={modalClosed}
            crossClose
            outsideClose
          />
          <Button
            type="success"
            onClick={handleIniciarTrabajoClick}
            disabled={percentageLoading < 100}
          >
            Iniciar Trabajo
          </Button>
        </div>
      </section>
    </article>
  )
}
