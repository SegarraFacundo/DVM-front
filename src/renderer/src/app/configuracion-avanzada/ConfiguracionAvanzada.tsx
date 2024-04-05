import { useTitle } from '@renderer/lib/hooks/UseTitle'
import { Button } from '@renderer/ui/components/Button'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import showPassword from './icons/eye.svg'
import hidePasword from './icons/hidden.svg'
import { Modal } from '@renderer/ui/components/modal/Modal'
import { ConfiguracionDeNodo } from './components/ConfiguracionDeNodo'
import { useModal } from '@renderer/ui/components/modal/hooks/UseModal'

const PASSWORD_CONFIGURACION_AVANZADA = '2024.C0NFIGURACI0N'

export default function ConfiguracionAvanzada(): JSX.Element {
  const { setTitle } = useTitle()
  const [passwordType, setPasswordType] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [estaHabilitado, setEstaHabilitado] = useState<boolean>(false)

  useEffect(() => {
    setTitle('Configuración Avanzada')
  }, [])

  const handleIngresarClick = (): void => {
    if (inputRef.current && PASSWORD_CONFIGURACION_AVANZADA === inputRef.current.value) {
      setError(false)
      setEstaHabilitado(true)
    } else {
      setError(true)
      setEstaHabilitado(false)
    }
  }

  return (
    <article className="w-full flex flex-col justify-center items-center content-center h-[100%] px-20 gap-8">
      {estaHabilitado && (
        <div className="flex flex-col mt-[46px] relative">
          <label className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap mb-[13px]">
            Contraseña
          </label>
          <input
            className={clsx(
              'h-[64px] w-[366px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
              {
                'border-error': error,
                'focus:border-error': error,
                'focus-visible:border-error': error
              }
            )}
            type={passwordType ? 'password' : 'text'}
            ref={inputRef}
          />
          <div onClick={() => setPasswordType((prev) => !prev)}>
            {passwordType ? (
              <img
                className="absolute cursor-pointer top-[60%] right-[5px] -translate-x-2/4"
                src={showPassword}
                alt="Hide"
              />
            ) : (
              <img
                className="absolute cursor-pointer top-[55%] right-[5px] -translate-x-2/4"
                src={hidePasword}
                alt="Show"
              />
            )}
          </div>
          {!error && (
            <p className="absolute top-[150%] text-white text-[20px]">
              Contraseña incorrecta. Inténtelo nuevamente.
            </p>
          )}
        </div>
      )}
      {!estaHabilitado && <Ajustes />}
      <div className="flex w-full items-end justify-end mb-10">
        <Button type="success" size="lg" maxWith={false} onClick={handleIngresarClick}>
          Guardar
        </Button>
      </div>
    </article>
  )
}

function Ajustes(): JSX.Element {
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const [error, setError] = useState<boolean>(false)

  const openModal = (idModal: string): void => {
    if (getStateModal(idModal)) return
    toggleOpenedState(idModal)
  }

  const modalClosed = (idModal: string, acept: boolean) => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
      if (idModal === 'configuracion-de-nodo') {
        
      }
    }
  }

  useEffect(() => {
    addModal('configuracion-de-nodo')
  }, [])

  return (
    <div className="bg-dark rounded-[5px] w-full h-[528px] overflow-y-scroll flex flex-col gap-8 p-20">
      <p className="font-roboto text-white text-[20px]">
        Ajuste de los valores por defecto para el trabajo
      </p>
      <div className=" flex flex-col gap-4">
        <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
          Dimensiones del trabajo
        </h4>
        <div className="flex flex-col">
          <label className="font-roboto text-white text-[20px]">Ancho</label>
          <div className="flex gap-4 items-center">
            <input
              className={clsx(
                'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                {
                  'border-error': error,
                  'focus:border-error': error,
                  'focus-visible:border-error': error
                }
              )}
              type="number"
            />
            <small className="font-roboto text-white text-[20px]">cm</small>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
          Gota
        </h4>
        <p className="font-roboto text-white text-[20px]">
          Parámetros específicos que definen las características de cada tipo de gota
        </p>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="font-roboto text-white text-[20px]">Fina</label>
            <div className="flex gap-4 items-center">
              <input
                className={clsx(
                  'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                  {
                    'border-error': error,
                    'focus:border-error': error,
                    'focus-visible:border-error': error
                  }
                )}
                type="number"
              />
              <small className="font-roboto text-white text-[20px]">RPM</small>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-roboto text-white text-[20px]">Media</label>
            <div className="flex gap-4 items-center">
              <input
                className={clsx(
                  'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                  {
                    'border-error': error,
                    'focus:border-error': error,
                    'focus-visible:border-error': error
                  }
                )}
                type="number"
              />
              <small className="font-roboto text-white text-[20px]">RPM</small>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-roboto text-white text-[20px]">Gruesa</label>
            <div className="flex gap-4 items-center">
              <input
                className={clsx(
                  'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                  {
                    'border-error': error,
                    'focus:border-error': error,
                    'focus-visible:border-error': error
                  }
                )}
                type="number"
              />
              <small className="font-roboto text-white text-[20px]">RPM</small>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-roboto text-white text-[20px]">Custom</label>
            <div className="flex gap-4 items-center">
              <input
                className={clsx(
                  'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                  {
                    'border-error': error,
                    'focus:border-error': error,
                    'focus-visible:border-error': error
                  }
                )}
                type="number"
              />
              <small className="font-roboto text-white text-[20px]">RPM</small>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex flex-col gap-4">
        <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
          Tolerancia de RPM
        </h4>
        <p className="font-roboto text-white text-[20px]">
          Ajuste de la variabilidad en el funcionamiento de los aspersores
        </p>
        <div className="flex flex-col">
          <label className="font-roboto text-white text-[20px]">Variación +/-</label>
          <div className="flex gap-4 items-center">
            <input
              className={clsx(
                'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                {
                  'border-error': error,
                  'focus:border-error': error,
                  'focus-visible:border-error': error
                }
              )}
              type="number"
            />
            <small className="font-roboto text-white text-[20px]">%</small>
          </div>
        </div>
      </div>
      <div className=" flex flex-col gap-4">
        <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
          Corriente de motores
        </h4>
        <p className="font-roboto text-white text-[20px]">
          Define los valores máximos y mínimos de corriente, así como los límites para
          cortocircuitos, durante el funcionamiento normal de los motores
        </p>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="font-roboto text-white text-[20px]">Máximo</label>
            <div className="flex gap-4 items-center">
              <input
                className={clsx(
                  'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                  {
                    'border-error': error,
                    'focus:border-error': error,
                    'focus-visible:border-error': error
                  }
                )}
                type="number"
              />
              <small className="font-roboto text-white text-[20px]">A</small>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-roboto text-white text-[20px]">Mínimo</label>
            <div className="flex gap-4 items-center">
              <input
                className={clsx(
                  'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                  {
                    'border-error': error,
                    'focus:border-error': error,
                    'focus-visible:border-error': error
                  }
                )}
                type="number"
              />
              <small className="font-roboto text-white text-[20px]">A</small>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-roboto text-white text-[20px]">Límite</label>
            <div className="flex gap-4 items-center">
              <input
                className={clsx(
                  'h-[60px] w-[150px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
                  {
                    'border-error': error,
                    'focus:border-error': error,
                    'focus-visible:border-error': error
                  }
                )}
                type="number"
              />
              <small className="font-roboto text-white text-[20px]">A</small>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="flex gap-4 items-center">
            <label className="font-roboto text-white text-[20px]">Sensor RPM</label>
            <input
              className={clsx(
                'h-[33px] w-[33px] appearance-none rounded-[5px] checked:appearance-auto accent-success bg-transparent border border-solid border-white',
                {
                  'border-error': error,
                  'focus:border-error': error,
                  'focus-visible:border-error': error
                }
              )}
              type="checkbox"
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="font-roboto text-white text-[20px]">Electroválvula</label>
            <input
              className={clsx(
                'h-[33px] w-[33px] appearance-none rounded-[5px] checked:appearance-auto accent-success bg-transparent border border-solid border-white',
                {
                  'border-error': error,
                  'focus:border-error': error,
                  'focus-visible:border-error': error
                }
              )}
              type="checkbox"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className=" flex justify-between  gap-4">
          <div className="flex flex-col">
            <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              Nodos
            </h4>
            <p className="font-roboto text-white text-[20px]">
              Modifica las especificaciones individuales de cada nodo
            </p>
          </div>
          <Button type="success" maxWith={false} size="sm">
            Escanear
          </Button>
        </div>
        <div className="w-full h-auto rounded-[5px] border border-solid border-success p-12 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <p className="font-roboto text-white text-[20px]">NODO A:</p>{' '}
              <span className="font-roboto text-success text-[20px]">Id: 0000</span>
            </div>
            <Button type="success-light" size="sm" maxWith={false} onClick={() => openModal('configuracion-de-nodo')}>
              Configuración
            </Button>
            <div className="flex gap-4">
              <p className="font-roboto text-white text-[20px]">NODO A:</p>{' '}
              <span className="font-roboto text-success text-[20px]">Id: 0000</span>
            </div>
            <Button type="success-light" size="sm" maxWith={false} onClick={() => openModal('configuracion-de-nodo')}>
              Configuración
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <p className="font-roboto text-white text-[20px]">NODO A:</p>{' '}
              <span className="font-roboto text-success text-[20px]">Id: 0000</span>
            </div>
            <Button type="success-light" size="sm" maxWith={false} onClick={() => openModal('configuracion-de-nodo')}>
              Configuración
            </Button>
            <div className="flex gap-4">
              <p className="font-roboto text-white text-[20px]">NODO A:</p>{' '}
              <span className="font-roboto text-success text-[20px]">Id: 0000</span>
            </div>
            <Button type="success-light" size="sm" maxWith={false} onClick={() => openModal('configuracion-de-nodo')}>
              Configuración
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <p className="font-roboto text-white text-[20px]">NODO A:</p>{' '}
              <span className="font-roboto text-success text-[20px]">Id: 0000</span>
            </div>
            <Button type="success-light" size="sm" maxWith={false} onClick={() => openModal('configuracion-de-nodo')}>
              Configuración
            </Button>
            <div className="flex gap-4">
              <p className="font-roboto text-white text-[20px]">NODO A:</p>{' '}
              <span className="font-roboto text-success text-[20px]">Id: 0000</span>
            </div>
            <Button type="success-light" size="sm" maxWith={false} onClick={() => openModal('configuracion-de-nodo')}>
              Configuración
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <p className="font-roboto text-white text-[20px]">NODO A:</p>{' '}
              <span className="font-roboto text-success text-[20px]">Id: 0000</span>
            </div>
            <Button type="success-light" size="sm" maxWith={false} onClick={() => openModal('configuracion-de-nodo')}>
              Configuración
            </Button>
            <div className="flex gap-4">
              <p className="font-roboto text-white text-[20px]">NODO A:</p>{' '}
              <span className="font-roboto text-success text-[20px]">Id: 0000</span>
            </div>
            <Button type="success-light" size="sm" maxWith={false} onClick={() => openModal('configuracion-de-nodo')}>
              Configuración
            </Button>
            <Modal<undefined>
            idModal="configuracion-de-nodo"
            ModalContent={ConfiguracionDeNodo}
            closed={modalClosed}
            crossClose
            outsideClose
          />
          </div>
        </div>  
      </div>
    </div>
  )
}
