import { useEffect, useState } from 'react'
import { useTitle } from '../../lib/hooks/UseTitle'
import ImageMap from './images/image.png'
import { Modal } from '../../ui/components/modal/Modal'
import { useLocation, useNavigate } from 'react-router-dom'
import { useModal } from '../../ui/components/modal/hooks/UseModal'
import { Nodo } from '../../ui/components/nodo/Nodo'
import { TipoGota } from './components/TipoGota'
import { Button } from '../../ui/components/Button'
import { TipoGotaType, useTipoGota } from './hooks/useTipoGota'
import { Socket, io } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import { Dialog } from '@renderer/ui/components/dialog/Dialog'
import { PanelLateralDerecha } from './components/PanelLateralDerecha'
import { PanelLateralIzquierdo } from './components/PanelLateralIzquierdo'
import { ConfiguracionesAvanzadasData } from '../configuracion-avanzada/interfaces/configuraciones-avanzadas-data'
import PreparacionBomba from '@renderer/ui/components/preparacion-bomba/PreparacionBomba'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000')

export function Trabajo(): JSX.Element {
  const { setTitle } = useTitle()
  const navigate = useNavigate()
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const { tipoGotaseleccionada } = useTipoGota()
  const [nodos, setNodos] = useState<JSX.Element[]>([])
  const [runningJob, setRunningJob] = useState<boolean>(false)
  const { state } = useLocation()
  const [direccionViento, setDireccionViento] = useState<number>(0)
  const [configuracionesAvanzadasData, setConfiguracionesAvanzadasData] =
    useState<ConfiguracionesAvanzadasData>()

  const fetchConfiguracionesAvanzadas = async () => {
    const configuracionesAvanzadasData = await window.api.invoke.getConfiguracionesAvanzadasAsync()
    console.info('fetchConfiguracionesAvanzadas: %j', configuracionesAvanzadasData)
    setConfiguracionesAvanzadasData(configuracionesAvanzadasData)
  }

  useEffect(() => {
    if (state && state.length > 0)
      setNodos(
        state.map((nodoData, i) => {
          return <Nodo key={i} data={nodoData} animacion={false} />
        })
      )
  }, [state])

  useEffect(() => {
    addModal('tipo-gota')
    addModal('init-job')
    addModal('preparacion-bomba')
    addModal('end-job')
    setTitle('Trabajo')
    socket.on('getDatosMeteorologicos', (res) => setDireccionViento(res.dirViento ?? 0))
    fetchConfiguracionesAvanzadas()
  }, [])

  const modalClosed = (idModal: string, acept: boolean) => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
      if (idModal === 'init-job') {
        toggleOpenedState('preparacion-bomba')
      }
      if (idModal === 'end-job') {
        finalizarTrabajoClick()
      }
      if (idModal === 'preparacion-bomba') {
        iniciarOPausarTrabajoClick()
      }
    }
  }

  const finalizarTrabajoClick = () => {
    socket.emit('stopJob')
    navigate('/reportes')
  }

  const openModal = (idModal: string): void => {
    if (getStateModal(idModal)) return
    toggleOpenedState(idModal)
  }

  const getRPMDeseado = (tipoGotaSeleccionada: TipoGotaType | undefined): number => {
    let rpmDeseado: number = 3500
    if (configuracionesAvanzadasData && tipoGotaSeleccionada)
      rpmDeseado = configuracionesAvanzadasData.gota[tipoGotaSeleccionada.toLowerCase()]
    console.log('RPM Deseado para el trabajo:', rpmDeseado)
    return rpmDeseado
  }
  const iniciarOPausarTrabajoClick = () => {
    if (runningJob) {

      socket.emit('stopJob')
      setNodos(
        nodos.map((nodo, i) => {
          return <Nodo key={i} data={nodo.props['data']} animacion={false} />
        })
      )
    } else {
      socket.emit('startJob', getRPMDeseado(tipoGotaseleccionada))
      socket.on('getStateNodo', (nodos) => {
        if (nodos) {
          setNodos(
            nodos.map((nodoData, i) => {
              return <Nodo key={i} data={nodoData} animacion={true} />
            })
          )
        }
      })
    }
    setRunningJob(!runningJob)
  }

  return (
    <article className="w-full grid grid-cols-1 gap-10 h-[100%] px-20 py-16">
      <section className="grid grid-cols-3 gap-4 w-full">{nodos}</section>
      <section className="grid grid-cols-4 gap-4 w-full">
        <div className="w-full grid grid-cols-3 gap-2">
          <div className="col-span-3">
            <Button onClick={() => openModal('tipo-gota')} size="lg" type="success">
              {tipoGotaseleccionada || 'TIPO DE GOTA'}
            </Button>
            <Modal<undefined>
              idModal="tipo-gota"
              ModalContent={TipoGota}
              modalContentProps={undefined}
              closed={modalClosed}
              crossClose
              outsideClose
            />
          </div>
          <Button type="default" size="sm">
            <svg
              width="51"
              height="39"
              viewBox="0 0 51 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.0416051 19.595C0.059046 21.2552 0.818751 22.8425 2.15609 24.0129L17.5309 37.5824C18.2024 38.1701 19.1107 38.5 20.0575 38.5C21.0043 38.5 21.9127 38.1701 22.5842 37.5824C22.9201 37.289 23.1867 36.94 23.3686 36.5554C23.5506 36.1709 23.6443 35.7584 23.6443 35.3418C23.6443 34.9252 23.5506 34.5128 23.3686 34.1282C23.1867 33.7437 22.9201 33.3946 22.5842 33.1013L10.7932 22.7506L46.6319 22.7506C47.5824 22.7506 48.494 22.4182 49.1661 21.8264C49.8382 21.2346 50.2158 20.4319 50.2158 19.595C50.2158 18.758 49.8382 17.9554 49.1661 17.3636C48.494 16.7718 47.5824 16.4393 46.6319 16.4393L10.7932 16.4393L22.5842 6.05708C23.259 5.46704 23.64 4.66511 23.6434 3.82771C23.6468 2.9903 23.2722 2.18602 22.6021 1.59179C21.932 0.997565 21.0212 0.662066 20.0702 0.65911C19.1192 0.656149 18.2058 0.985976 17.5309 1.57602L2.15609 15.1455C0.810034 16.3236 0.0496081 17.9238 0.0416051 19.595Z"
                fill="#1C2E3D"
              />
            </svg>
          </Button>
          <Button type="default" size="sm">
            <svg
              width="39"
              height="39"
              viewBox="0 0 39 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.3062 36.135C27.3062 37.4405 26.2431 38.5001 24.9331 38.5001C23.6232 38.5001 22.5601 37.4405 22.5601 36.135C22.5601 34.8295 23.6232 33.77 24.9331 33.77C26.2431 33.77 27.3062 34.8295 27.3062 36.135ZM36.0076 16.4262C37.3176 16.4262 38.3807 15.3667 38.3807 14.0612C38.3807 12.7557 37.3176 11.6961 36.0076 11.6961C34.6977 11.6961 33.6345 12.7557 33.6345 14.0612C33.6345 15.3667 34.6977 16.4262 36.0076 16.4262ZM13.8587 33.77C12.5487 33.77 11.4856 34.8295 11.4856 36.135C11.4856 37.4405 12.5487 38.5001 13.8587 38.5001C15.1686 38.5001 16.2318 37.4405 16.2318 36.135C16.2318 34.8295 15.1686 33.77 13.8587 33.77ZM36.0076 33.77C34.6977 33.77 33.6345 34.8295 33.6345 36.135C33.6345 37.4405 34.6977 38.5001 36.0076 38.5001C37.3176 38.5001 38.3807 37.4405 38.3807 36.135C38.3807 34.8295 37.3176 33.77 36.0076 33.77ZM36.0076 22.7803C34.6977 22.7803 33.6345 23.8399 33.6345 25.1454C33.6345 26.4509 34.6977 27.5105 36.0076 27.5105C37.3176 27.5105 38.3807 26.4509 38.3807 25.1454C38.3807 23.8399 37.3176 22.7803 36.0076 22.7803ZM30.4704 28.2515C29.1604 28.2515 28.0973 29.3111 28.0973 30.6166C28.0973 31.9221 29.1604 32.9816 30.4704 32.9816C31.7803 32.9816 32.8435 31.9221 32.8435 30.6166C32.8435 29.3111 31.7803 28.2515 30.4704 28.2515ZM19.3959 28.2515C18.086 28.2515 17.0228 29.3111 17.0228 30.6166C17.0228 31.9221 18.086 32.9816 19.3959 32.9816C20.7059 32.9816 21.769 31.9221 21.769 30.6166C21.769 29.3111 20.7059 28.2515 19.3959 28.2515ZM24.9331 22.733C23.6232 22.733 22.5601 23.7926 22.5601 25.0981C22.5601 26.4036 23.6232 27.4632 24.9331 27.4632C26.2431 27.4632 27.3062 26.4036 27.3062 25.0981C27.3062 23.7926 26.2431 22.733 24.9331 22.733ZM30.4704 17.2146C29.1604 17.2146 28.0973 18.2741 28.0973 19.5796C28.0973 20.8851 29.1604 21.9447 30.4704 21.9447C31.7803 21.9447 32.8435 20.8851 32.8435 19.5796C32.8435 18.2741 31.7803 17.2146 30.4704 17.2146ZM11.5647 28.961C11.9697 28.961 12.3747 28.8065 12.6832 28.4991C13.3018 27.8826 13.3018 26.8861 12.6832 26.2696C10.8907 24.4832 9.90353 22.1071 9.90353 19.5796C9.90353 17.0522 10.8907 14.6777 12.6832 12.8897C16.3852 9.20177 22.4066 9.20177 26.1086 12.8897C26.7272 13.5062 27.7271 13.5062 28.3457 12.8897C28.9643 12.2732 28.9643 11.2751 28.3457 10.6602C27.9391 10.255 27.5056 9.89709 27.061 9.5581L29.5006 5.37668C29.9404 4.62301 29.6841 3.65807 28.9294 3.22132C28.1732 2.783 27.205 3.04 26.7668 3.79051L24.3272 7.97036C23.2498 7.51784 22.1218 7.22458 20.978 7.0811V2.23588C20.978 1.36554 20.2708 0.65918 19.3959 0.65918C18.521 0.65918 17.8139 1.36554 17.8139 2.23588V7.08267C16.6763 7.22458 15.5547 7.51469 14.482 7.96247L12.0472 3.79051C11.609 3.03685 10.6376 2.77985 9.88454 3.22132C9.12831 3.65807 8.87202 4.62459 9.31342 5.37668L11.7466 9.54706C11.2957 9.88921 10.8575 10.2519 10.4462 10.6602C10.0475 11.0575 9.69153 11.4817 9.35771 11.9169L5.16366 9.484C4.40743 9.04409 3.43921 9.3011 3.00097 10.0532C2.56274 10.8069 2.81745 11.7718 3.5721 12.2101L7.75983 14.6398C7.29945 15.7214 7.00044 16.8535 6.85647 18.0029H1.9932C1.11832 18.0029 0.411133 18.7093 0.411133 19.5796C0.411133 20.45 1.11832 21.1563 1.9932 21.1563H6.85489C6.99885 22.3026 7.2947 23.4315 7.7535 24.51L3.58001 26.9302C2.82378 27.3686 2.56907 28.3335 3.00888 29.0856C3.30315 29.5886 3.83314 29.8692 4.37737 29.8692C4.6479 29.8692 4.9216 29.8014 5.17157 29.6548L9.3498 27.2314C9.68678 27.6697 10.0427 28.097 10.4462 28.4975C10.7547 28.8049 11.1597 28.9594 11.5647 28.9594V28.961Z"
                fill="#1C2E3D"
              />
            </svg>
          </Button>
          <Button type="default" size="sm">
            <svg
              width="46"
              height="39"
              viewBox="0 0 46 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45.8884 19.5642C45.8727 17.904 45.189 16.3167 43.9855 15.1463L30.1493 1.57683C29.545 0.989081 28.7276 0.65918 27.8755 0.65918C27.0235 0.65918 26.206 0.989081 25.6018 1.57683C25.2995 1.87019 25.0595 2.21921 24.8958 2.60376C24.732 2.98831 24.6477 3.40078 24.6477 3.81736C24.6477 4.23395 24.732 4.64642 24.8958 5.03097C25.0595 5.41551 25.2995 5.76454 25.6018 6.0579L36.2127 16.4085L3.96057 16.4085C3.10519 16.4085 2.28484 16.741 1.68 17.3328C1.07515 17.9246 0.735352 18.7273 0.735352 19.5642C0.735352 20.4012 1.07515 21.2038 1.68 21.7956C2.28484 22.3874 3.10519 22.7199 3.96057 22.7199L36.2127 22.7199L25.6018 33.1021C24.9944 33.6921 24.6515 34.4941 24.6485 35.3315C24.6455 36.1689 24.9826 36.9732 25.5856 37.5674C26.1887 38.1616 27.0083 38.4971 27.8641 38.5001C28.72 38.503 29.542 38.1732 30.1493 37.5832L43.9855 24.0137C45.1968 22.8356 45.8812 21.2354 45.8884 19.5642Z"
                fill="#1C2E3D"
              />
            </svg>
          </Button>
        </div>
        <div
          className="col-span-2 w-full h-full bg-white flex justify-evenly items-center"
          style={{
            backgroundImage: `url(${ImageMap})`
          }}
        >
          <div
            style={{
              transform: `rotate(${direccionViento}deg)`
            }}
          >
            <svg
              width="70"
              height="37"
              viewBox="0 0 70 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M67.3372 12.6778L56.0769 1.5889C55.8064 1.32308 55.4846 1.11209 55.13 0.968111C54.7754 0.824129 54.3951 0.75 54.011 0.75C53.6269 0.75 53.2466 0.824129 52.8921 0.968111C52.5375 1.11209 52.2157 1.32308 51.9452 1.5889C51.4033 2.12027 51.0991 2.83907 51.0991 3.58831C51.0991 4.33756 51.4033 5.05636 51.9452 5.58773L62.3035 15.7691H2.97604C2.20436 15.7691 1.46428 16.0679 0.918619 16.5998C0.372956 17.1317 0.0664063 17.853 0.0664062 18.6052C0.0664063 19.3574 0.372956 20.0787 0.918619 20.6106C1.46428 21.1424 2.20436 21.4412 2.97604 21.4412H62.4781L51.9452 31.6794C51.6725 31.943 51.456 32.2567 51.3083 32.6023C51.1606 32.9479 51.0845 33.3186 51.0845 33.693C51.0845 34.0674 51.1606 34.438 51.3083 34.7836C51.456 35.1292 51.6725 35.4429 51.9452 35.7066C52.2157 35.9724 52.5375 36.1834 52.8921 36.3274C53.2466 36.4713 53.6269 36.5455 54.011 36.5455C54.3951 36.5455 54.7754 36.4713 55.13 36.3274C55.4846 36.1834 55.8064 35.9724 56.0769 35.7066L67.3372 24.7027C68.9718 23.1074 69.89 20.9449 69.89 18.6903C69.89 16.4356 68.9718 14.2731 67.3372 12.6778Z"
                fill="#1C2E3D"
              />
            </svg>
          </div>

          <svg
            width="55"
            height="75"
            viewBox="0 0 55 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9768 67.26C11.8258 66.8457 11.5746 66.4403 11.5435 66.0172C11.4772 65.1166 11.5252 64.2073 11.5252 63.3009C11.5252 56.4947 11.5252 49.6886 11.5252 42.8824C11.5252 41.8761 11.3629 41.7174 10.3735 41.7512C8.5203 41.8129 7.18089 43.2952 7.17948 45.3255C7.17383 53.9679 7.17525 62.6104 7.17948 71.2529C7.17948 73.0584 8.24649 74.4584 9.81455 74.7551C11.4715 75.068 12.9013 74.2086 13.5308 72.4722C13.6634 72.1049 13.837 71.9845 14.1927 71.9977C14.8179 72.0212 15.4432 72.0036 16.0614 72.0036C16.1178 71.6657 16.1574 71.4321 16.1983 71.1824H39.1433C39.18 71.4659 39.2111 71.6995 39.2506 72.0021C40.0763 72.0021 40.8723 72.0344 41.6655 71.9904C42.2047 71.961 42.4799 72.1094 42.6888 72.6852C43.2533 74.2439 44.7748 75.0592 46.3358 74.7493C47.8333 74.4525 48.9426 73.0951 48.9455 71.4556C48.9568 62.6662 48.961 53.8769 48.9426 45.0875C48.9384 42.7458 46.6816 41.1665 44.5744 41.954C44.0508 42.1493 43.808 42.4299 43.8122 43.0719C43.8419 48.0417 43.8306 53.0116 43.8306 57.9814C43.8306 60.6007 43.8362 63.2201 43.8278 65.8409C43.8235 67.2159 43.1291 68.209 42.0268 68.4676C42.9852 67.8843 43.6358 67.1469 43.633 65.8673C43.6118 56.5197 43.6259 47.1721 43.6217 37.8244C43.6217 36.1864 42.6944 35.2301 41.1122 35.2286C32.1555 35.2227 23.1974 35.2227 14.2407 35.2286C12.6303 35.2286 11.6945 36.2085 11.6945 37.87C11.6903 47.1691 11.6875 56.4668 11.703 65.766C11.703 66.264 11.8837 66.7605 11.9796 67.257L11.9768 67.26ZM47.8276 10.7071C47.8276 11.1272 47.8276 11.3652 47.8276 11.6017C47.8276 13.2427 47.8361 14.8821 47.8192 16.5231C47.8149 16.9226 47.9279 17.1445 48.3033 17.2884C50.1706 17.998 52.0336 18.0112 53.8868 17.2752C54.0858 17.1959 54.3243 16.8771 54.3271 16.6656C54.3596 14.3885 54.3511 12.1115 54.3412 9.8359C54.3412 9.68752 54.2594 9.42162 54.1832 9.4084C53.6412 9.31438 53.7739 8.89276 53.7739 8.55194C53.7668 6.66714 53.7781 4.78233 53.7682 2.89606C53.7626 1.75313 53.1204 0.785021 52.1366 0.37956C50.3018 -0.375537 48.4839 0.905483 48.4204 3.0459C48.3724 4.61192 48.412 6.17941 48.4035 7.74543C48.3993 8.47261 48.6434 9.32026 47.6258 9.59938C47.5298 9.62582 47.4621 9.76979 47.3816 9.85793C46.9272 10.3545 46.5023 10.8863 46.0055 11.3299C45.7515 11.5576 45.369 11.7486 45.0416 11.7516C42.2668 11.7839 39.4905 11.7707 36.7157 11.7677C36.4899 11.7677 36.2641 11.7369 35.9705 11.7163C35.9705 10.043 35.9536 8.43295 35.986 6.82286C35.9917 6.50848 36.1342 5.97521 36.3107 5.92673C36.902 5.7666 37.4313 5.03207 38.1667 5.70637C38.9542 6.43062 40.1355 6.06482 40.4757 5.06586C41.0459 3.39113 40.3317 2.47591 38.6493 2.72859C38.6028 2.73593 38.5562 2.74768 38.5096 2.75209C37.8745 2.80645 37.5245 3.07822 37.619 3.82597C37.6487 4.05662 37.5273 4.44004 37.3593 4.53994C36.9684 4.77205 36.5054 4.87488 36.0157 5.05117C35.8731 4.11097 35.3086 3.97141 34.6001 3.97435C30.0836 3.98757 25.5685 3.98463 21.0521 3.97435C20.2476 3.97288 19.4374 3.89355 19.3062 5.03942C19.0366 4.95421 18.8842 4.88957 18.7233 4.85725C17.9922 4.70888 17.5349 4.36071 17.6859 3.47928C17.7127 3.32062 17.6238 3.02534 17.5123 2.97392C16.7036 2.60372 15.8257 2.5288 15.0635 2.96804C14.8151 3.11054 14.8575 3.80835 14.7728 4.25347C14.7587 4.32399 14.7728 4.40038 14.7714 4.47383C14.7558 5.15547 15.0311 5.66671 15.6323 5.93995C16.2265 6.21026 16.7628 6.0707 17.2794 5.66083C17.4573 5.5198 17.7649 5.48895 18.0021 5.51539C18.2745 5.54624 18.5285 5.72547 18.8023 5.79158C19.2554 5.90176 19.3697 6.18675 19.3626 6.6451C19.3401 8.11416 19.3302 9.58322 19.3683 11.0508C19.3838 11.6517 19.1707 11.7912 18.6344 11.7853C16.0938 11.7604 13.5533 11.7266 11.0142 11.7971C10.0601 11.8235 9.35162 11.6032 8.78141 10.7864C8.43986 10.2957 8.04608 9.67724 7.55209 9.5083C6.80123 9.24974 6.9099 8.76495 6.9099 8.23169C6.90708 6.51729 6.92119 4.80437 6.90285 3.08998C6.8845 1.3653 5.74974 0.153325 4.19579 0.159201C2.66443 0.165077 1.5466 1.41819 1.54237 3.14286C1.53813 4.97919 1.5466 6.81551 1.5339 8.65184C1.53249 8.87513 1.46615 9.27178 1.37159 9.29088C0.881836 9.39518 0.967931 9.75657 0.96652 10.0842C0.963697 12.1893 0.980633 14.296 0.955228 16.4011C0.949583 16.9226 1.10201 17.1974 1.58894 17.3604C3.12878 17.8775 4.67425 17.9789 6.24231 17.5396C7.06845 17.3085 7.48152 16.7615 7.48152 15.8987C7.48152 15.483 7.48152 15.0658 7.48152 14.65C7.48152 13.3896 7.48152 12.1291 7.48152 10.8686C7.54503 10.8319 7.60995 10.7952 7.67347 10.7599C8.03055 11.1669 8.41445 11.5518 8.73625 11.9866C9.13426 12.5257 9.61978 12.6653 10.2591 12.6565C13.0114 12.6198 15.7636 12.6624 18.5144 12.6227C19.1989 12.6124 19.3739 12.8254 19.3711 13.5262C19.3443 20.3573 19.3528 27.187 19.3499 34.0181C19.3499 34.3295 19.3499 34.6395 19.3499 34.9524H35.9677C35.9677 34.594 35.9677 34.3031 35.9677 34.0122C35.9677 27.1576 35.9776 20.3015 35.955 13.4468C35.9536 12.8034 36.1102 12.6139 36.7397 12.6227C39.1617 12.6609 41.5893 12.5478 44.0056 12.6727C45.4184 12.7446 46.5235 12.4464 47.3224 11.1948C47.4099 11.0582 47.5581 10.9627 47.8262 10.7071H47.8276ZM39.8928 34.9774C39.8928 31.3312 39.9267 27.7893 39.8688 24.2474C39.8547 23.3527 39.2478 22.7122 38.3939 22.4874C37.9253 22.364 37.4158 22.4169 36.9289 22.3567C36.3234 22.2832 36.1173 22.5007 36.123 23.1676C36.1526 26.8594 36.1357 30.5526 36.1371 34.2458C36.1371 34.4823 36.1611 34.7188 36.1752 34.9774H39.8928ZM19.1326 22.3626C18.6301 22.3626 18.1672 22.3552 17.7043 22.3626C16.2604 22.392 15.439 23.2558 15.4376 24.7527C15.4333 27.9068 15.4347 31.0609 15.4376 34.2135C15.4376 34.4529 15.4587 34.6939 15.4714 34.9583H19.134V22.3611L19.1326 22.3626Z"
              fill="white"
            />
            <path
              d="M47.8291 10.7071C47.5609 10.9627 47.4127 11.0582 47.3252 11.1948C46.5263 12.4464 45.4212 12.7461 44.0084 12.6727C41.5921 12.5478 39.1645 12.6624 36.7426 12.6227C36.1131 12.6124 35.9564 12.8034 35.9578 13.4468C35.979 20.3015 35.9705 27.1561 35.9705 34.0122C35.9705 34.3031 35.9705 34.5925 35.9705 34.9524H19.3528C19.3528 34.6395 19.3528 34.3281 19.3528 34.0181C19.3542 27.187 19.3471 20.3573 19.3739 13.5262C19.3768 12.824 19.2017 12.6124 18.5172 12.6227C15.7664 12.6624 13.0128 12.6198 10.262 12.6565C9.62261 12.6653 9.13567 12.5257 8.73907 11.9866C8.41868 11.5518 8.03337 11.1669 7.67629 10.7599C7.61278 10.7967 7.54785 10.8334 7.48434 10.8686C7.48434 12.1291 7.48434 13.3896 7.48434 14.65C7.48434 15.0658 7.48434 15.483 7.48434 15.8987C7.48434 16.7596 7.07127 17.3066 6.24514 17.5396C4.67708 17.9789 3.1316 17.8775 1.59177 17.3604C1.10201 17.1974 0.949583 16.9226 0.955228 16.4011C0.980633 14.296 0.963697 12.1908 0.96652 10.0842C0.96652 9.75657 0.880424 9.39518 1.37159 9.29088C1.46615 9.27031 1.53249 8.87513 1.5339 8.65184C1.5466 6.81551 1.53813 4.97919 1.54237 3.14286C1.54801 1.41819 2.66584 0.165077 4.1972 0.159201C5.75115 0.153325 6.88591 1.3653 6.90426 3.08998C6.92261 4.8029 6.90849 6.51729 6.91131 8.23168C6.91131 8.76495 6.80264 9.24974 7.5535 9.5083C8.04749 9.67871 8.44127 10.2972 8.78282 10.7864C9.35303 11.6046 10.0615 11.8235 11.0157 11.7971C13.5548 11.7266 16.0953 11.7604 18.6358 11.7853C19.1721 11.7912 19.3866 11.6517 19.3697 11.0508C19.3316 9.58322 19.3415 8.11269 19.3641 6.6451C19.3711 6.18675 19.2568 5.90322 18.8037 5.79158C18.5313 5.72547 18.2773 5.54624 18.0035 5.51539C17.7664 5.48748 17.4587 5.5198 17.2808 5.66083C16.7629 6.06923 16.2279 6.21026 15.6337 5.93995C15.0325 5.66671 14.7573 5.15547 14.7728 4.47383C14.7742 4.40038 14.7615 4.32399 14.7742 4.25347C14.8603 3.80835 14.8165 3.11054 15.0649 2.96804C15.8271 2.53026 16.705 2.60519 17.5137 2.97392C17.6252 3.02534 17.7155 3.32062 17.6873 3.47928C17.5363 4.36218 17.9936 4.70888 18.7247 4.85725C18.8842 4.88957 19.038 4.95421 19.3076 5.03942C19.4374 3.89208 20.249 3.97288 21.0535 3.97435C25.57 3.9861 30.085 3.98757 34.6015 3.97435C35.31 3.97288 35.8745 4.11244 36.0171 5.05117C36.5069 4.87635 36.9698 4.77352 37.3607 4.53994C37.5301 4.44004 37.6501 4.05662 37.6204 3.82597C37.5245 3.07822 37.8759 2.80645 38.511 2.75209C38.5576 2.74768 38.6042 2.73593 38.6508 2.72859C40.3317 2.47591 41.0473 3.39113 40.4771 5.06586C40.137 6.06482 38.9556 6.43062 38.1681 5.70637C37.4341 5.0306 36.9049 5.7666 36.3121 5.92673C36.1357 5.97374 35.9945 6.50848 35.9875 6.82286C35.955 8.43295 35.9719 10.043 35.9719 11.7163C36.2641 11.7369 36.4899 11.7677 36.7172 11.7677C39.4934 11.7706 42.2682 11.7839 45.043 11.7516C45.3704 11.7471 45.7529 11.5576 46.007 11.3299C46.5038 10.8848 46.9286 10.353 47.3831 9.85793C47.4635 9.76979 47.5313 9.62582 47.6272 9.59938C48.6449 9.31879 48.4007 8.47261 48.4049 7.74543C48.4134 6.17794 48.3739 4.61045 48.4219 3.0459C48.4868 0.904014 50.3032 -0.377006 52.1381 0.37956C53.1218 0.78502 53.7626 1.75313 53.7696 2.89606C53.7795 4.78086 53.7696 6.66567 53.7753 8.55194C53.7753 8.89276 53.6426 9.31438 54.1846 9.4084C54.2594 9.42162 54.3412 9.68605 54.3427 9.8359C54.3525 12.1129 54.361 14.39 54.3285 16.6656C54.3257 16.8771 54.0872 17.1974 53.8882 17.2752C52.035 18.0112 50.172 17.998 48.3047 17.2884C47.9293 17.1459 47.8164 16.9226 47.8206 16.5231C47.8389 14.8836 47.8291 13.2426 47.8291 11.6017C47.8291 11.3652 47.8291 11.1287 47.8291 10.7071ZM25.9863 7.40901H29.3214V5.8048H25.9863V7.40901Z"
              fill="#1C2E3D"
            />
            <path
              d="M11.5101 67.2599C11.4141 66.7634 11.2335 66.2653 11.2335 65.7688C11.218 56.4697 11.2208 47.172 11.225 37.8728C11.225 36.2113 12.1608 35.2329 13.7712 35.2315C22.7279 35.2256 31.686 35.2256 40.6427 35.2315C42.2249 35.2315 43.1508 36.1878 43.1522 37.8273C43.1564 47.1749 43.1423 56.5225 43.1635 65.8702C43.1663 67.1497 42.5156 67.8872 41.5573 68.4704L41.5799 68.4498C41.227 68.4542 40.8756 68.4616 40.5228 68.4616C32.3903 68.4616 24.2564 68.4689 16.124 68.4557C14.8848 68.4542 13.6456 68.3588 12.4064 68.3059C12.1071 67.9577 11.8079 67.6095 11.5087 67.2628L11.5101 67.2599ZM27.1907 64.2189C30.0135 64.2189 32.8363 64.2219 35.6591 64.2189C37.8044 64.216 39.0958 62.8968 39.0987 60.6697C39.1085 54.7685 39.1114 48.8687 39.1029 42.9675C39.1001 40.8638 37.8228 39.4844 35.8129 39.477C30.0502 39.455 24.2861 39.455 18.5233 39.48C16.5855 39.4888 15.3068 40.8756 15.3039 42.8823C15.2983 48.832 15.2969 54.7817 15.3039 60.7314C15.3068 62.8777 16.601 64.2175 18.6504 64.2204C21.4971 64.2248 24.3425 64.2204 27.1893 64.2219L27.1907 64.2189Z"
              fill="#1C2E3D"
            />
            <path
              d="M11.9163 67.2597C12.2155 67.6078 12.5147 67.956 12.8139 68.3027C13.8598 68.4702 14.9056 68.6376 16.0192 68.8154C16.0249 68.8477 16.0587 68.9858 16.0644 69.1254C16.0983 69.8903 16.4873 70.2727 17.2316 70.2727C24.1912 70.2727 31.1508 70.2727 38.1104 70.2712C38.4293 70.2712 38.7497 70.2404 39.0998 70.2228C39.1139 69.9627 39.1294 69.7718 39.1336 69.5793C39.1477 68.6479 39.1477 68.67 40.0666 68.6347C40.7087 68.6097 41.3481 68.5113 41.9903 68.4467L41.9677 68.4672C43.0714 68.2101 43.7644 67.2156 43.7687 65.8406C43.7771 63.2212 43.7715 60.6019 43.7715 57.9811C43.7715 53.0113 43.7828 48.0414 43.7531 43.0716C43.7489 42.4296 43.9916 42.149 44.5153 41.9536C46.6239 41.1662 48.8793 42.7455 48.8835 45.0871C48.9019 53.8765 48.8977 62.6659 48.8864 71.4553C48.885 73.0948 47.7742 74.4522 46.2767 74.7489C44.7157 75.0589 43.1956 74.2436 42.6297 72.6849C42.4208 72.109 42.147 71.9607 41.6064 71.99C40.8132 72.0326 40.0172 72.0018 39.1915 72.0018C39.152 71.6992 39.1209 71.4656 39.0842 71.1821H16.1378C16.0954 71.4318 16.0573 71.6654 16.0009 72.0033C15.3827 72.0033 14.7574 72.0194 14.1322 71.9974C13.7765 71.9842 13.6029 72.1046 13.4702 72.4719C12.8408 74.2068 11.4124 75.0662 9.75403 74.7548C8.18597 74.4595 7.12037 73.058 7.11896 71.2526C7.11472 62.6101 7.11331 53.9676 7.11896 45.3251C7.11896 43.2949 8.45978 41.8126 10.3129 41.7509C11.3023 41.7171 11.4646 41.8758 11.4646 42.8821C11.4646 49.6882 11.4646 56.4944 11.4646 63.3005C11.4646 64.207 11.4167 65.1163 11.483 66.0168C11.514 66.4399 11.7653 66.8469 11.9163 67.2597Z"
              fill="#1C2E3D"
            />
            <path
              d="M29.3676 34.9773H25.65C25.6359 34.7188 25.6119 34.4822 25.6119 34.2457C25.6105 30.5525 25.6288 26.8608 25.5978 23.1675C25.5921 22.5006 25.7982 22.2832 26.4037 22.3566C26.8906 22.4154 27.4001 22.364 27.8687 22.4874C28.7226 22.7121 29.3295 23.3526 29.3436 24.2473C29.4001 27.7877 29.3676 31.3311 29.3676 34.9773Z"
              fill="#1C2E3D"
            />
            <path
              d="M29.2957 22.3623V34.9595H25.6332C25.6205 34.6951 25.6007 34.4556 25.5993 34.2147C25.5979 31.0606 25.5965 27.9065 25.5993 24.7539C25.6007 23.257 26.4235 22.3932 27.866 22.3638C28.3289 22.355 28.7919 22.3638 29.2943 22.3638L29.2957 22.3623Z"
              fill="#1C2E3D"
            />
            <path d="M25.5977 7.4089V5.80469H28.9328V7.4089H25.5977Z" fill="white" />
            <path
              d="M27.2207 64.2187C24.3739 64.2187 21.5286 64.2216 18.6818 64.2187C16.6324 64.2158 15.3382 62.876 15.3354 60.7297C15.3283 54.78 15.3283 48.8303 15.3354 42.8806C15.3382 40.8739 16.6155 39.4871 18.5548 39.4783C24.3175 39.4533 30.0816 39.4548 35.8444 39.4753C37.8542 39.4827 39.1315 40.8621 39.1343 42.9658C39.1428 48.867 39.14 54.7668 39.1301 60.668C39.1258 62.8951 37.8358 64.2143 35.6905 64.2172C32.8677 64.2216 30.0449 64.2172 27.2221 64.2172L27.2207 64.2187ZM38.3863 51.8815C38.3863 48.8964 38.3905 45.9113 38.3849 42.9262C38.382 41.2206 37.435 40.2275 35.8062 40.226C30.0943 40.2216 24.381 40.2216 18.6691 40.226C17.0079 40.226 16.0566 41.2279 16.0552 42.9717C16.0524 48.8935 16.0509 54.8138 16.0552 60.7356C16.0552 62.4617 17.0135 63.4783 18.6818 63.4812C24.3937 63.4915 30.107 63.4915 35.8189 63.4812C37.4406 63.4783 38.3835 62.4588 38.3849 60.7649C38.3877 57.8048 38.3849 54.8432 38.3863 51.883V51.8815Z"
              fill="white"
            />
            <path
              d="M42.4527 68.4482C41.812 68.5143 41.1726 68.6112 40.529 68.6362C39.6102 68.6729 39.6102 68.6494 39.5961 69.5808C39.5932 69.7733 39.5763 69.9642 39.5622 70.2243C39.2122 70.2419 38.8932 70.2727 38.5728 70.2727C31.6132 70.2757 24.6536 70.2742 17.694 70.2742C16.9488 70.2742 16.5597 69.8918 16.5268 69.1269C16.5212 68.9873 16.4873 68.8492 16.4816 68.8169C15.3681 68.6391 14.3222 68.4717 13.2764 68.3042C14.5156 68.3556 15.7548 68.4511 16.994 68.454C25.1264 68.4673 33.2603 68.4614 41.3928 68.4599C41.7456 68.4599 42.0971 68.4526 42.4499 68.4482H42.4527Z"
              fill="white"
            />
            <path
              d="M38.6906 51.8829C38.6906 54.8431 38.692 57.8047 38.6892 60.7649C38.6878 62.4572 37.7436 63.4782 36.1233 63.4811C30.4114 63.4929 24.6981 63.4914 18.9861 63.4811C17.3193 63.4782 16.361 62.4631 16.3595 60.7355C16.3567 54.8137 16.3567 48.8934 16.3595 42.9716C16.3595 41.2278 17.3122 40.2274 18.9734 40.2259C24.6854 40.223 30.3987 40.2215 36.1106 40.2259C37.7379 40.2259 38.685 41.2205 38.6892 42.9261C38.6949 45.9112 38.6906 48.8963 38.6892 51.8814L38.6906 51.8829Z"
              fill="#1C2E3D"
            />
          </svg>
          <div className="w-[70px]"></div>
        </div>
        <div className="flex flex-col justify-around gap-4">
          <Button
            onClick={() => openModal('end-job')}
            type="error"
            size="lg"
            disabled={!runningJob}
          >
            Finalizar
          </Button>

          <Modal<{
            title: string
            message: string
            type: 'success' | 'warning' | 'error' | 'default'
          }>
            idModal="end-job"
            ModalContent={Dialog}
            modalContentProps={{
              title: 'Finalizar trabajo',
              message: '¿Desea finalizar trabajo?',
              type: 'error'
            }}
            closed={modalClosed}
            crossClose
            outsideClose
          />
          <Button
            onClick={() => openModal('init-job')}
            type={runningJob ? 'warning' : 'success'}
            size="lg"
            disabled={!tipoGotaseleccionada}
          >
            {!runningJob ? 'Iniciar Trabajo' : 'Pausar'}
          </Button>
          <Modal<{
            title: string
            message: string
            type: 'success' | 'warning' | 'error' | 'default'
          }>
            idModal="init-job"
            ModalContent={Dialog}
            modalContentProps={{
              title: runningJob ? 'Pausar trabajo' : 'Iniciar trabajo',
              message: runningJob
                ? '¿Desea pausar todos los aspersores?'
                : 'Se iniciará el funcionamiento de los<br />aspersores, ¿Desea Continuar?',
              type: 'warning'
            }}
            closed={modalClosed}
            crossClose
            outsideClose
          />
          <Modal<undefined>
            idModal="preparacion-bomba"
            ModalContent={PreparacionBomba}
            closed={modalClosed}
            crossClose
            outsideClose
          />
        </div>
      </section>
      <PanelLateralIzquierdo />
      <PanelLateralDerecha />
    </article>
  )
}
