import { useTitle } from '@renderer/lib/hooks/UseTitle'
import { Button } from '@renderer/ui/components/Button'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import showPassword from './icons/eye.svg'
import hidePasword from './icons/hidden.svg'
import { Modal } from '@renderer/ui/components/modal/Modal'
import { ConfiguracionDeNodo } from './components/ConfiguracionDeNodo'
import { useModal } from '@renderer/ui/components/modal/hooks/UseModal'
import { NodoData } from '@renderer/ui/components/nodo/interfaces/nodo-data'
import { ConfiguracionesAvanzadasData } from './interfaces/configuraciones-avanzadas-data'
import { Socket, io } from 'socket.io-client'
import Keyboard from 'react-simple-keyboard'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('/')

export default function ConfiguracionAvanzada(): JSX.Element {
  const { setTitle } = useTitle()
  const [passwordType, setPasswordType] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [estaHabilitado, setEstaHabilitado] = useState<boolean>(false)
  const [configuracionesAvanzadasData, setConfiguracionesAvanzadasData] =
    useState<ConfiguracionesAvanzadasData>(null)
  const [value, setValue] = useState<string>('')
  const divRef = useRef<HTMLDivElement>(null)
  const [theme, setTheme] = useState<string>('hg-theme-default')
  const keyboardRef = useRef<any>(null)
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)

  const setThemeKeyboard = async (): Promise<void> => {
    const result = await window.api.invoke.isThemeModeDark()
    setTheme(result ? 'hg-theme-dark' : 'hg-theme-default')
  }

  useEffect(() => {
    setThemeKeyboard()

    const handleClickOutside = (event): void => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        divRef.current &&
        !divRef.current.contains(event.target)
      ) {
        setShowKeyboard(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  const onKeyPress = (button: string): void => {
    if (button === '{enter}') {
      setShowKeyboard(false)
      handleGuardarClick()
    }
  }

  const onFocusInput = (): void => {
    setShowKeyboard(true)
    keyboardRef.current.setInput(value)
  }

  const fetchConfiguracionesAvanzadas = async () => {
    const configuracionesAvanzadasData: ConfiguracionesAvanzadasData =
      await window.api.invoke.getConfiguracionesAvanzadasAsync()
    console.info('fetchConfiguracionesAvanzadas: %j', configuracionesAvanzadasData)
    setConfiguracionesAvanzadasData(configuracionesAvanzadasData)
  }

  useEffect(() => {
    fetchConfiguracionesAvanzadas()
    setTitle('Configuración Avanzada')
  }, [])

  const editConfiguracionesAvanzadas = async (): void => {
    const configuracionesAvanzadasEditData =
      await window.api.invoke.editConfiguracionesAvanzadasAsync(configuracionesAvanzadasData)
    console.info('fetchConfiguracionesAvanzadas: %j', configuracionesAvanzadasEditData)
    setConfiguracionesAvanzadasData(configuracionesAvanzadasEditData)
  }

  const handleGuardarClick = (): void => {
    if (inputRef.current && configuracionesAvanzadasData.password === inputRef.current.value) {
      setError(false)
      setEstaHabilitado(true)
      editConfiguracionesAvanzadas()
    } else {
      setError(true)
      setEstaHabilitado(false)
    }
  }

  const handleDataFromChild = (data): void => {
    setConfiguracionesAvanzadasData(data)
  }

  const display = {
    '{bksp}': 'Retroceso',
    '{enter}': 'Enter',
    '{space}': 'Espacio',
    '{tab}': 'Tab',
    '{lock}': 'Lock',
    '{shift}': 'Shift'
  }

  return (
    <article className="w-full flex flex-col justify-center items-center content-center h-[100%] px-20 gap-8">
      {!estaHabilitado && (
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
            value={value}
            onClick={onFocusInput}
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
          {error && (
            <p className="absolute top-[150%] text-white text-[20px]">
              Contraseña incorrecta.
              <br /> Inténtelo nuevamente.
            </p>
          )}
          <div
            ref={divRef}
            className={clsx('fixed inset-x-0 bottom-0 z-50', {
              hidden: !showKeyboard
            })}
          >
            <Keyboard
              keyboardRef={(r) => (keyboardRef.current = r)}
              display={display}
              onChange={setValue}
              onKeyPress={onKeyPress}
              onKeyReleased={() => {
                if (inputRef && inputRef.current) inputRef.current.value = value
              }}
              theme={theme}
            />
          </div>
        </div>
      )}
      {estaHabilitado && (
        <Ajustes
          valueInicial={configuracionesAvanzadasData}
          sendConfiguracionesAvanzadasData={handleDataFromChild}
        />
      )}
      <div className="flex w-full items-end justify-end mb-10">
        <Button type="success" size="lg" maxWith={false} onClick={handleGuardarClick}>
          {estaHabilitado ? 'Guardar' : 'Ingresar'}
        </Button>
      </div>
    </article>
  )
}

interface AjustesProp {
  valueInicial: ConfiguracionesAvanzadasData
  sendConfiguracionesAvanzadasData: (value: ConfiguracionesAvanzadasData) => void
}

function Ajustes({ valueInicial, sendConfiguracionesAvanzadasData }: AjustesProp): JSX.Element {
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const [error, setError] = useState<boolean>(false)
  const [nodos, setNodos] = useState<NodoData[]>([])
  const [configuracionesAvanzadasData, setConfiguracionesAvanzadasData] =
    useState<ConfiguracionesAvanzadasData>(valueInicial)
  const [nodosDisponibles, setNodosDisponibles] = useState<number[]>([])

  const fetchNodos = async () => {
    const nodos = await window.api.invoke.getNodosAsync()
    console.info('fetchNodos: %j', nodos)
    setNodos(nodos)
  }

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
    fetchNodos()
    addModal('nodos-disponibles')
    nodos.forEach((_, i) => addModal('configuracion-de-nodo' + i))
  }, [nodos])

  const onChangeConfiguracionesAvanzada = (
    event: ChangeEvent,
    type:
      | 'ancho'
      | 'gota.fina'
      | 'gota.media'
      | 'gota.gruesa'
      | 'gota.custom'
      | 'variacionRPM'
      | 'corriente.maximo'
      | 'corriente.minimo'
      | 'corriente.limite'
      | 'sensorRPM'
      | 'electroValvula'
  ) => {
    if (type === 'ancho' || type === 'variacionRPM')
      configuracionesAvanzadasData[type] = parseFloat(event.target.value)
    else if (type === 'sensorRPM' || type === 'electroValvula')
      configuracionesAvanzadasData[type] = event.target.checked
    else
      configuracionesAvanzadasData[type.split('.')[0]][type.split('.')[1]] = parseFloat(
        event.target.value
      )

    setConfiguracionesAvanzadasData(configuracionesAvanzadasData)
    sendConfiguracionesAvanzadasData({
      ...configuracionesAvanzadasData
    })
  }

  const escanear = (): void => {
    socket.emit('scan')
    socket.on('rtaScan', (nodosDisponibles: number[]) => {
      setNodosDisponibles(nodosDisponibles)
      openModal('nodos-disponibles')
    })
  }

  return (
    <div className="bg-dark rounded-[5px] w-full h-[528px] overflow-y-scroll flex flex-col gap-8 p-20">
      <p className="font-roboto text-white text-[20px]">
        Ajuste de los valores por defecto para el trabajo
      </p>
      {configuracionesAvanzadasData && (
        <div className=" flex flex-col gap-8">
          <div className=" flex flex-col gap-4">
            <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              Dimensiones del trabajo
            </h4>
            <div className="flex flex-col">
              <label className="font-roboto text-white text-[20px]">Ancho</label>
              <div className="flex gap-4 items-center">
                <input
                  value={configuracionesAvanzadasData.ancho}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'ancho')}
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
                    value={configuracionesAvanzadasData.gota.fina}
                    onChange={($e) => onChangeConfiguracionesAvanzada($e, 'gota.fina')}
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
                    value={configuracionesAvanzadasData.gota.media}
                    onChange={($e) => onChangeConfiguracionesAvanzada($e, 'gota.media')}
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
                    value={configuracionesAvanzadasData.gota.gruesa}
                    onChange={($e) => onChangeConfiguracionesAvanzada($e, 'gota.gruesa')}
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
                    value={configuracionesAvanzadasData.gota.custom}
                    onChange={($e) => onChangeConfiguracionesAvanzada($e, 'gota.custom')}
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
                  value={configuracionesAvanzadasData.variacionRPM}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'variacionRPM')}
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
                    value={configuracionesAvanzadasData.corriente.maximo}
                    onChange={($e) => onChangeConfiguracionesAvanzada($e, 'corriente.maximo')}
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
                    value={configuracionesAvanzadasData.corriente.minimo}
                    onChange={($e) => onChangeConfiguracionesAvanzada($e, 'corriente.minimo')}
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
                    value={configuracionesAvanzadasData.corriente.limite}
                    onChange={($e) => onChangeConfiguracionesAvanzada($e, 'corriente.limite')}
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
                  checked={configuracionesAvanzadasData.sensorRPM}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'sensorRPM')}
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
                  checked={configuracionesAvanzadasData.electroValvula}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'electroValvula')}
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
        </div>
      )}
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
          <Button type="success" maxWith={false} size="sm" onClick={escanear}>
            Escanear
          </Button>
          <Modal<{
            nodosDisponibles: number[]
          }>
            idModal={'nodos-disponibles'}
            ModalContent={ResultadoDeEscaneoPuerto}
            modalContentProps={{ nodosDisponibles }}
            closed={modalClosed}
            crossClose
            outsideClose
          />
        </div>
        <div className="w-full h-auto rounded-[5px] border border-solid border-success p-12 flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-4">
            {nodos?.map((nodoData, i) => {
              return (
                <div key={i}>
                  <div className="flex gap-4">
                    <p className="font-roboto text-white text-[20px]">NODO {nodoData.nombre}:</p>{' '}
                    <span className="font-roboto text-success text-[20px]">Id: {nodoData.id}</span>
                  </div>
                  <Button
                    type="success-light"
                    size="sm"
                    maxWith={false}
                    onClick={() => openModal('configuracion-de-nodo' + i)}
                  >
                    Configuración
                  </Button>
                  <Modal<{
                    nodoData: NodoData
                  }>
                    idModal={'configuracion-de-nodo' + i}
                    ModalContent={ConfiguracionDeNodo}
                    modalContentProps={{ nodoData }}
                    closed={modalClosed}
                    crossClose
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  nodosDisponibles: number[]
}

function ResultadoDeEscaneoPuerto({ nodosDisponibles }: Props): JSX.Element {
  return (
    <>
      {nodosDisponibles.length > 0 &&
        nodosDisponibles.map((n, i) => {
          return <div key={i}>Valor: {n}</div>
        })}
    </>
  )
}
