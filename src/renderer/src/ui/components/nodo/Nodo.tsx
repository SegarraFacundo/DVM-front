import { useEffect, useState } from 'react'
import { AspersorData, NodoData } from './interfaces/nodo-data'
import clsx from 'clsx'
import { Modal } from '../modal/Modal'
import { DetailNodo } from './components/DetailNodo'
import { useModal } from '../modal/hooks/UseModal'

interface Props {
  data: NodoData
  posicion: number
  animacion?: boolean
}

export function Nodo({ data, posicion, animacion = false }: Props): JSX.Element {
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const [nodoData, setNodoData] = useState<NodoData>(data)

  let aspersores = nodoData.aspersores.map(function (aspersorData, i) {
    if (nodoData.deshabilitado) {
      aspersorData.deshabilitado = true
    }
    return (
      <Aspersor
        key={i}
        posicion={posicion * 4 + aspersorData.id}
        data={aspersorData}
        animacion={animacion && !!aspersorData.rpm && !!aspersorData.rpmDeseado}
      />
    )
  })

  useEffect(() => {
    setNodoData(data)
    aspersores = nodoData.aspersores.map(function (aspersorData, i) {
      if (nodoData.deshabilitado) {
        aspersorData.deshabilitado = true
      }
      return (
        <Aspersor
          key={i}
          posicion={posicion * 4 + aspersorData.id}
          data={aspersorData}
          animacion={animacion}
        />
      )
    })
  }, [data, animacion])

  useEffect(() => {
    addModal(`detail-nodo-${nodoData.nombre}`)
  }, [data])

  const handleClickNodo = () => {
    if (!getStateModal(`detail-nodo-${nodoData.nombre}`))
      toggleOpenedState(`detail-nodo-${nodoData.nombre}`)
  }

  const modalClosed = (idModal: string, acept: boolean): void => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
    }
  }

  const nodoChange = (value: NodoData): void => {
    toggleOpenedState(`detail-nodo-${nodoData.nombre}`)
    if (value.deshabilitado !== nodoData.deshabilitado) {
      window.api.invoke.cambiarHabilitacionNodo(nodoData.id)
      return
    }
    value.aspersores.forEach((a) =>
      window.api.invoke.cambiarHabilitacionAspersor(data.id, a.id, a.deshabilitado)
    )
    setNodoData(value)
  }

  return (
    <>
      <Modal<{
        data: NodoData
        nodoChange: (value: NodoData) => void
      }>
        idModal={`detail-nodo-${nodoData.nombre}`}
        ModalContent={DetailNodo}
        modalContentProps={{
          data: nodoData,
          nodoChange
        }}
        closed={modalClosed}
        crossClose
        outsideClose
      />
      <section
        className={clsx(
          'flex gap-8 bg-light dark:bg-dark border-[1px] rounded-md border-[#A1A1A1] h-[140px] p-6 text-dark dark:text-light shadow-2xl',
          {
            'bg-opacity-5': nodoData.deshabilitado,
            'text-gray-600': nodoData.deshabilitado
          }
        )}
        onClick={handleClickNodo}
      >
        <div className="flex flex-col justify-center items-center">
          <p className="text-[20px] font-bold">NODO</p>
          <h2 className="text-[48px] font-bold">{nodoData.nombre}</h2>
        </div>
        <div className="flex flex-row justify-around w-full">{aspersores}</div>
      </section>
    </>
  )
}

interface PropsAspersor {
  data: AspersorData
  posicion: number
  animacion?: boolean
}

function Aspersor({ data, posicion, animacion = false }: PropsAspersor): JSX.Element {
  const [color, setColor] = useState<string>('')
  const [speed, setSpeed] = useState<string>('animate-[spin_8s_linear_infinite]')

  useEffect(() => {
    if (data.deshabilitado) {
      data.estado = {
        id: -1,
        descripcion: ''
      }
    }
    switch (data.estado?.id) {
      case 0: // Ok
        setColor('#32CF9C')
        if (animacion) setSpeed('animate-[spin_20s_linear_infinite]')
        else setSpeed('animate-[spin_0s_linear_infinite]')
        break
      case 1:
      case 2:
        setColor('#DC3545')
        setSpeed('animate-[spin_0s_linear_infinite]')
        break
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        setColor('#FFC107')
        if (animacion) setSpeed('animate-[spin_40s_linear_infinite]')
        else setSpeed('animate-[spin_0s_linear_infinite]')
        break
      case -1: // Deshabilitado
        setColor('#696767')
        setSpeed('animate-[spin_0s_linear_infinite]')
        break
    }
  }, [data, animacion])

  return (
    <div className="flex flex-col items-center">
      <div className={speed}>
        <svg
          width="41"
          height="44"
          viewBox="0 0 41 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={color}
            d="M2.76205 35.0468C1.94208 33.4382 1.11879 31.8329 0.298822 30.2243C0.119558 29.8708 0.318741 29.4459 0.710467 29.3486L7.97069 27.552C8.90685 27.3184 9.6903 26.5142 9.91936 25.551C10.2381 24.2115 9.32181 23.0927 8.75082 22.5446L3.26665 17.174C3.26665 17.174 3.25005 17.1578 3.24341 17.1513C2.71226 16.6908 1.61343 15.5914 1.36445 13.9309C1.11215 12.2542 1.85909 10.8791 2.42012 9.84456C2.7023 9.32242 3.00439 8.8846 3.27661 8.5311C3.51563 8.22301 3.98039 8.20355 4.24597 8.48894L14.5769 19.509L14.63 19.5577C15.1346 20.0279 17.6576 22.59 17.2393 26.3455C16.9173 29.2643 14.9421 31.8037 12.0772 32.9939C12.0506 33.0036 12.0207 33.0133 11.9942 33.0231L3.50235 35.3646C3.21021 35.4457 2.89816 35.3127 2.76537 35.0468"
          />
          <path
            fill={color}
            d="M17.5929 0.689697C19.4287 0.819422 21.2612 0.949146 23.097 1.07563C23.4987 1.10482 23.7743 1.4875 23.6581 1.86695L21.5401 8.88504C21.2679 9.78987 21.5766 10.8568 22.3103 11.5444C23.3294 12.4946 24.7801 12.2968 25.5536 12.0925L33.0761 10.2212C33.0761 10.2212 33.0993 10.2147 33.1093 10.2115C33.7865 10.0007 35.3136 9.63744 36.9037 10.2731C38.5072 10.9152 39.3404 12.2449 39.9645 13.2438C40.2799 13.7465 40.5123 14.2232 40.6849 14.6318C40.8343 14.9886 40.6152 15.3907 40.2268 15.4686L25.2548 18.5365L25.1851 18.556C24.5145 18.7409 20.9724 19.5549 17.8751 17.2912C15.4683 15.5334 14.2367 12.5757 14.6517 9.56285C14.655 9.53366 14.6616 9.50772 14.6683 9.47853L16.9356 1.15022C17.012 0.864825 17.2908 0.670239 17.5929 0.69294"
          />
          <path
            fill={color}
            d="M39.8749 30.4749C38.8789 31.9862 37.8797 33.4943 36.8838 35.0056C36.6647 35.3364 36.1866 35.385 35.9045 35.1061L30.6195 29.9236C29.9389 29.2555 28.8302 29.0058 27.8641 29.3074C26.523 29.7225 26.0018 31.0619 25.8125 31.8241L23.8805 39.1697C23.8805 39.1697 23.8738 39.1924 23.8738 39.2022C23.741 39.8832 23.3327 41.3685 21.9982 42.4226C20.6504 43.4895 19.0602 43.5641 17.8618 43.6193C17.2576 43.6485 16.7198 43.6193 16.2683 43.5706C15.8766 43.5285 15.621 43.1458 15.7372 42.7761L20.169 28.4707L20.1856 28.4026C20.3416 27.7378 21.311 24.313 24.8299 22.7466C27.5653 21.5304 30.8087 21.8937 33.3184 23.6936C33.3417 23.7098 33.3649 23.7293 33.3881 23.7487L39.7819 29.6869C40.001 29.8912 40.0442 30.2187 39.8782 30.4685"
          />
        </svg>
      </div>
      <p className="text-[24px]">{posicion}</p>
    </div>
  )
}
