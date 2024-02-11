import { useEffect, useState } from 'react'
import { useTitle } from '../../lib/hooks/UseTitle'
import GoogleMapReact from 'google-map-react'
import { Modal } from '../../ui/components/modal/Modal'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../ui/components/modal/hooks/UseModal'
import { NodoData } from '../../ui/components/nodo/interfaces/nodo-data'
import { Nodo } from '../../ui/components/nodo/Nodo'
import { TipoGota } from './components/TipoGota'
import { Button } from '../../ui/components/Button'
import { useTipoGota } from './hooks/useTipoGota'
import { EstadoAspersores } from './components/EstadoAspersores'

interface Props {
  lat: number
  lng: number
  text: string
}
const AnyReactComponent = ({ text }: Props) => <div>{text}</div>

export function Trabajo () {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  }
  const { setTitle } = useTitle()
  const [data, setData] = useState<NodoData[]>()
  const navigate = useNavigate()
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const { tipoGotaseleccionada } = useTipoGota()

  const fetchData = async () => {
    const response = await fetch('/data/nodos.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    const result = await response.json()
    setData(result)
  }

  useEffect(() => {
    addModal('tipo-gota')
    fetchData()
  }, [])

  const nodos = data?.map(function (nodoData, i) {
    return (
      <Nodo key={i} data={nodoData} />
    )
  })

  useEffect(() => {
    fetchData()
    setTitle('Trabajo')
  }, [])

  const modalClosed = (acept: boolean) => {
    if (acept) { navigate('/trabajo') }
  }

  const handleTipoGotaClick = () => {
    if (getStateModal('tipo-gota')) return
    toggleOpenedState('tipo-gota')
  }

  const handleFinalizarTrabajoClick = () => {

  }

  const handleIniciarTrabajoClick = () => {

  }

  return (
    <article
      className='w-full grid grid-cols-1 gap-10 h-[100%] px-20 py-16'
    >
      <section className='grid grid-cols-3 gap-4'>
        {nodos}
      </section>
      <section className='grid grid-cols-4 gap-4 w-full'>
        <div className='w-full grid grid-cols-3 gap-2'>
          <div className='col-span-3'>
            <Button
              onClick={handleTipoGotaClick}
              size='lg'
              type='success'
            >
              {tipoGotaseleccionada || 'TIPO DE GOTA'}
            </Button>
            <Modal<undefined>
              idModal='tipo-gota'
              ModalContent={TipoGota}
              modalContentProps={undefined}
              closed={modalClosed}
              crossClose
              outsideClose
            />
          </div>
          <Button
            type='default'
            size='sm'
          >
            <svg width='51' height='39' viewBox='0 0 51 39' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M0.0416051 19.595C0.059046 21.2552 0.818751 22.8425 2.15609 24.0129L17.5309 37.5824C18.2024 38.1701 19.1107 38.5 20.0575 38.5C21.0043 38.5 21.9127 38.1701 22.5842 37.5824C22.9201 37.289 23.1867 36.94 23.3686 36.5554C23.5506 36.1709 23.6443 35.7584 23.6443 35.3418C23.6443 34.9252 23.5506 34.5128 23.3686 34.1282C23.1867 33.7437 22.9201 33.3946 22.5842 33.1013L10.7932 22.7506L46.6319 22.7506C47.5824 22.7506 48.494 22.4182 49.1661 21.8264C49.8382 21.2346 50.2158 20.4319 50.2158 19.595C50.2158 18.758 49.8382 17.9554 49.1661 17.3636C48.494 16.7718 47.5824 16.4393 46.6319 16.4393L10.7932 16.4393L22.5842 6.05708C23.259 5.46704 23.64 4.66511 23.6434 3.82771C23.6468 2.9903 23.2722 2.18602 22.6021 1.59179C21.932 0.997565 21.0212 0.662066 20.0702 0.65911C19.1192 0.656149 18.2058 0.985976 17.5309 1.57602L2.15609 15.1455C0.810034 16.3236 0.0496081 17.9238 0.0416051 19.595Z' fill='#1C2E3D' />
            </svg>
          </Button>
          <Button
            type='default'
            size='sm'
          >
            <svg width='39' height='39' viewBox='0 0 39 39' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M27.3062 36.135C27.3062 37.4405 26.2431 38.5001 24.9331 38.5001C23.6232 38.5001 22.5601 37.4405 22.5601 36.135C22.5601 34.8295 23.6232 33.77 24.9331 33.77C26.2431 33.77 27.3062 34.8295 27.3062 36.135ZM36.0076 16.4262C37.3176 16.4262 38.3807 15.3667 38.3807 14.0612C38.3807 12.7557 37.3176 11.6961 36.0076 11.6961C34.6977 11.6961 33.6345 12.7557 33.6345 14.0612C33.6345 15.3667 34.6977 16.4262 36.0076 16.4262ZM13.8587 33.77C12.5487 33.77 11.4856 34.8295 11.4856 36.135C11.4856 37.4405 12.5487 38.5001 13.8587 38.5001C15.1686 38.5001 16.2318 37.4405 16.2318 36.135C16.2318 34.8295 15.1686 33.77 13.8587 33.77ZM36.0076 33.77C34.6977 33.77 33.6345 34.8295 33.6345 36.135C33.6345 37.4405 34.6977 38.5001 36.0076 38.5001C37.3176 38.5001 38.3807 37.4405 38.3807 36.135C38.3807 34.8295 37.3176 33.77 36.0076 33.77ZM36.0076 22.7803C34.6977 22.7803 33.6345 23.8399 33.6345 25.1454C33.6345 26.4509 34.6977 27.5105 36.0076 27.5105C37.3176 27.5105 38.3807 26.4509 38.3807 25.1454C38.3807 23.8399 37.3176 22.7803 36.0076 22.7803ZM30.4704 28.2515C29.1604 28.2515 28.0973 29.3111 28.0973 30.6166C28.0973 31.9221 29.1604 32.9816 30.4704 32.9816C31.7803 32.9816 32.8435 31.9221 32.8435 30.6166C32.8435 29.3111 31.7803 28.2515 30.4704 28.2515ZM19.3959 28.2515C18.086 28.2515 17.0228 29.3111 17.0228 30.6166C17.0228 31.9221 18.086 32.9816 19.3959 32.9816C20.7059 32.9816 21.769 31.9221 21.769 30.6166C21.769 29.3111 20.7059 28.2515 19.3959 28.2515ZM24.9331 22.733C23.6232 22.733 22.5601 23.7926 22.5601 25.0981C22.5601 26.4036 23.6232 27.4632 24.9331 27.4632C26.2431 27.4632 27.3062 26.4036 27.3062 25.0981C27.3062 23.7926 26.2431 22.733 24.9331 22.733ZM30.4704 17.2146C29.1604 17.2146 28.0973 18.2741 28.0973 19.5796C28.0973 20.8851 29.1604 21.9447 30.4704 21.9447C31.7803 21.9447 32.8435 20.8851 32.8435 19.5796C32.8435 18.2741 31.7803 17.2146 30.4704 17.2146ZM11.5647 28.961C11.9697 28.961 12.3747 28.8065 12.6832 28.4991C13.3018 27.8826 13.3018 26.8861 12.6832 26.2696C10.8907 24.4832 9.90353 22.1071 9.90353 19.5796C9.90353 17.0522 10.8907 14.6777 12.6832 12.8897C16.3852 9.20177 22.4066 9.20177 26.1086 12.8897C26.7272 13.5062 27.7271 13.5062 28.3457 12.8897C28.9643 12.2732 28.9643 11.2751 28.3457 10.6602C27.9391 10.255 27.5056 9.89709 27.061 9.5581L29.5006 5.37668C29.9404 4.62301 29.6841 3.65807 28.9294 3.22132C28.1732 2.783 27.205 3.04 26.7668 3.79051L24.3272 7.97036C23.2498 7.51784 22.1218 7.22458 20.978 7.0811V2.23588C20.978 1.36554 20.2708 0.65918 19.3959 0.65918C18.521 0.65918 17.8139 1.36554 17.8139 2.23588V7.08267C16.6763 7.22458 15.5547 7.51469 14.482 7.96247L12.0472 3.79051C11.609 3.03685 10.6376 2.77985 9.88454 3.22132C9.12831 3.65807 8.87202 4.62459 9.31342 5.37668L11.7466 9.54706C11.2957 9.88921 10.8575 10.2519 10.4462 10.6602C10.0475 11.0575 9.69153 11.4817 9.35771 11.9169L5.16366 9.484C4.40743 9.04409 3.43921 9.3011 3.00097 10.0532C2.56274 10.8069 2.81745 11.7718 3.5721 12.2101L7.75983 14.6398C7.29945 15.7214 7.00044 16.8535 6.85647 18.0029H1.9932C1.11832 18.0029 0.411133 18.7093 0.411133 19.5796C0.411133 20.45 1.11832 21.1563 1.9932 21.1563H6.85489C6.99885 22.3026 7.2947 23.4315 7.7535 24.51L3.58001 26.9302C2.82378 27.3686 2.56907 28.3335 3.00888 29.0856C3.30315 29.5886 3.83314 29.8692 4.37737 29.8692C4.6479 29.8692 4.9216 29.8014 5.17157 29.6548L9.3498 27.2314C9.68678 27.6697 10.0427 28.097 10.4462 28.4975C10.7547 28.8049 11.1597 28.9594 11.5647 28.9594V28.961Z' fill='#1C2E3D' />
            </svg>
          </Button>
          <Button
            type='default'
            size='sm'
          >
            <svg width='46' height='39' viewBox='0 0 46 39' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M45.8884 19.5642C45.8727 17.904 45.189 16.3167 43.9855 15.1463L30.1493 1.57683C29.545 0.989081 28.7276 0.65918 27.8755 0.65918C27.0235 0.65918 26.206 0.989081 25.6018 1.57683C25.2995 1.87019 25.0595 2.21921 24.8958 2.60376C24.732 2.98831 24.6477 3.40078 24.6477 3.81736C24.6477 4.23395 24.732 4.64642 24.8958 5.03097C25.0595 5.41551 25.2995 5.76454 25.6018 6.0579L36.2127 16.4085L3.96057 16.4085C3.10519 16.4085 2.28484 16.741 1.68 17.3328C1.07515 17.9246 0.735352 18.7273 0.735352 19.5642C0.735352 20.4012 1.07515 21.2038 1.68 21.7956C2.28484 22.3874 3.10519 22.7199 3.96057 22.7199L36.2127 22.7199L25.6018 33.1021C24.9944 33.6921 24.6515 34.4941 24.6485 35.3315C24.6455 36.1689 24.9826 36.9732 25.5856 37.5674C26.1887 38.1616 27.0083 38.4971 27.8641 38.5001C28.72 38.503 29.542 38.1732 30.1493 37.5832L43.9855 24.0137C45.1968 22.8356 45.8812 21.2354 45.8884 19.5642Z' fill='#1C2E3D' />
            </svg>

          </Button>
        </div>
        <div className='col-span-2 w-full'>
          <GoogleMapReact
            bootstrapURLKeys={{ key: import.meta.env.RENDERER_VITE_KEY_GOOGLE_MAP }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <AnyReactComponent
              lat={-33.0441700}
              lng={-61.1680600}
              text='My Marker'
            />
          </GoogleMapReact>
        </div>
        <div className='flex flex-col justify-around gap-4'>
          <Button
            onClick={handleFinalizarTrabajoClick}
            type='error'
            size='lg'
          >
            Finalizar
          </Button>
          <Modal<undefined>
            idModal='repetir-testing'
            ModalContent={EstadoAspersores}
            modalContentProps={undefined}
            closed={modalClosed}
            crossClose
            outsideClose
          />
          <Button
            type='success'
            size='lg'
            onClick={handleIniciarTrabajoClick}
          >
            Iniciar Trabajo
          </Button>
        </div>
      </section>
    </article>
  )
}
