import { useTitle } from '@renderer/lib/hooks/UseTitle'
import { Button } from '@renderer/ui/components/Button'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
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
import { DataSelect } from '../home/interfaces/data-select.interface'
import { Dialog, DialogType } from '@renderer/ui/components/dialog/Dialog'
import { InputNumber } from '@renderer/ui/components/input-number/InputNumber'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://127.0.0.1:3000')

export default function ConfiguracionAvanzada(): JSX.Element {
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const { setTitle } = useTitle()
  const [passwordType, setPasswordType] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [estaHabilitado, setEstaHabilitado] = useState<boolean>(false)
  const [configuracionesAvanzadasData, setConfiguracionesAvanzadasData] =
    useState<ConfiguracionesAvanzadasData>(null)
  const [value, setValue] = useState<string>('')
  const divRef = useRef<HTMLDivElement>(null)
  const keyboardRef = useRef(null)
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)

  useEffect(() => {
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

  const openModal = (idModal: string): void => {
    if (getStateModal(idModal)) return
    toggleOpenedState(idModal)
  }

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
    setConfiguracionesAvanzadasData(configuracionesAvanzadasData)
  }

  useEffect(() => {
    fetchConfiguracionesAvanzadas()
    setTitle('Configuración Avanzada')
    addModal('guardo-configuracion')
  }, [])

  const editConfiguracionesAvanzadas = async (): void => {
    const configuracionesAvanzadasEditData =
      await window.api.invoke.editConfiguracionesAvanzadasAsync(configuracionesAvanzadasData)
    setConfiguracionesAvanzadasData(configuracionesAvanzadasEditData)
    openModal('guardo-configuracion')
  }

  const handleGuardarClick = (): void => {
    if (estaHabilitado) editConfiguracionesAvanzadas()

    if (!estaHabilitado) {
      const habilitado = !!(
        inputRef.current && configuracionesAvanzadasData.password === inputRef.current.value
      )
      setError(!habilitado)
      setEstaHabilitado(habilitado)
    }
  }

  const handleDataFromChild = (data): void => {
    setConfiguracionesAvanzadasData(data)
  }

  const display = {
    '{bksp}': 'Borrar',
    '{enter}': 'Entrar',
    '{space}': 'Espacio',
    '{tab}': 'Tab',
    '{lock}': 'Lock',
    '{shift}': 'Shift'
  }

  const modalClosed = (idModal: string, acept: boolean): void => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
    }
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
              'h-[64px] w-[366px] text-2xl rounded-[5px] bg-white dark:bg-dark border border-solid border-dark dark:border-light pl-[18px] text-dark dark:text-light p-4',
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
              <div className="absolute cursor-pointer top-[60%] right-[5px] -translate-x-2/4 text-red">
                <svg
                  width="25"
                  height="17"
                  viewBox="0 0 25 17"
                  className="fill-current text-dark dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.5 2.26667C16.8068 2.26667 20.6477 4.68067 22.5227 8.5C20.6477 12.3193 16.8068 14.7333 12.5 14.7333C8.19318 14.7333 4.35227 12.3193 2.47727 8.5C4.35227 4.68067 8.19318 2.26667 12.5 2.26667ZM12.5 0C6.81818 0 1.96591 3.52467 0 8.5C1.96591 13.4753 6.81818 17 12.5 17C18.1818 17 23.0341 13.4753 25 8.5C23.0341 3.52467 18.1818 0 12.5 0ZM12.5 5.66667C14.0682 5.66667 15.3409 6.936 15.3409 8.5C15.3409 10.064 14.0682 11.3333 12.5 11.3333C10.9318 11.3333 9.65909 10.064 9.65909 8.5C9.65909 6.936 10.9318 5.66667 12.5 5.66667ZM12.5 3.4C9.68182 3.4 7.38636 5.68933 7.38636 8.5C7.38636 11.3107 9.68182 13.6 12.5 13.6C15.3182 13.6 17.6136 11.3107 17.6136 8.5C17.6136 5.68933 15.3182 3.4 12.5 3.4Z" />
                </svg>
              </div>
            ) : (
              <div className="absolute cursor-pointer top-[55%] right-[5px] -translate-x-2/4">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  className="fill-current text-dark dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 2L22 22" />
                  <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" />
                  <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" />
                </svg>
              </div>
            )}
          </div>
          {error && (
            <p className="absolute top-[150%] text-dark dark:text-light text-[20px]">
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
              theme="hg-theme-default"
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
        idModal="guardo-configuracion"
        ModalContent={Dialog}
        modalContentProps={{
          title: 'Exito',
          message: 'Se guardo satisfactoriamente la configuración',
          type: 'success',
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
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>('')
  const divRef = useRef<HTMLDivElement>(null)
  const keyboardRef = useRef(null)
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)

  useEffect(() => {
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

  const display = {
    '{bksp}': 'Borrar',
    '{enter}': 'Entrar',
    '{space}': 'Espacio',
    '{tab}': 'Tab',
    '{lock}': 'Lock',
    '{clear}': 'Limpiar',
    '{shift}': 'Shift'
  }

  const fetchNodos = async (): Promise<void> => {
    const nodos = await window.api.invoke.getNodosAsync()
    setNodos(nodos)
  }

  const openModal = (idModal: string): void => {
    if (getStateModal(idModal)) return
    toggleOpenedState(idModal)
  }

  const modalClosed = (idModal: string, acept: boolean): void => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
      if (idModal === 'guardar-configuracion-nodos') {
        cambiarIdsNodosAsync()
      }
      if (idModal === 'buscar-nodos-disponibles') {
        escanear()
      }
    } else {
      if (idModal.startsWith('configuracion-de-nodo')) {
        nodos[idModal.charAt(idModal.length - 1)].aspersores?.forEach((v) => {
          window.api.invoke.cambiarUbicacionAspersor(
            nodos[idModal.charAt(idModal.length - 1)].id,
            v.id,
            v.ubicacion ?? { id: 6, name: 'Sin asignar' }
          )
        })
        fetchNodos()
      }
    }
  }

  useEffect(() => {
    addModal('guardar-configuracion-nodos')
    addModal('buscar-nodos-disponibles')
  }, [])

  useEffect(() => {
    fetchNodos()
    addModal('nodos-disponibles')
    nodos.forEach((_, i) => addModal('configuracion-de-nodo' + i))
  }, [nodos])

  const onChangeConfiguracionesAvanzada = (
    value: string | ChangeEvent,
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
  ): void => {
    if (type === 'ancho' || type === 'variacionRPM')
      configuracionesAvanzadasData[type] = parseFloat(value)
    else if (type === 'sensorRPM' || type === 'electroValvula')
      configuracionesAvanzadasData[type] = value.target.checked
    else {
      configuracionesAvanzadasData[type.split('.')[0]][type.split('.')[1]] = parseFloat(value)
    }

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

  const handleGuardarClick = (): void => {
    openModal('guardar-configuracion-nodos')
  }

  const cambiarIdsNodosAsync = async (): Promise<void> => {
    await window.api.invoke.cambiarIdsNodosAsync(nodos)
    openModal('guardo-configuracion')
  }

  const onKeyPress = (button: string): void => {
    if (button === '{enter}') {
      setShowKeyboard(false)
    }
    if (button === '{clear}') setValue('')
  }

  return (
    <div className="bg-light dark:bg-dark rounded-[5px] w-full h-[528px] overflow-y-scroll touch-auto flex flex-col gap-8 p-20">
      <p className="font-roboto text-dark dark:text-light text-[20px]">
        Ajuste de los valores por defecto para el trabajo
      </p>
      {configuracionesAvanzadasData && (
        <div className=" flex flex-col gap-8">
          <div className=" flex flex-col gap-4">
            <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              Dimensiones del trabajo
            </h4>
            <div className="flex flex-col">
              <InputNumber
                label="Ancho"
                valueInitial={configuracionesAvanzadasData.ancho}
                unidad="cm"
                required={true}
                onChange={($e) => onChangeConfiguracionesAvanzada($e, 'ancho')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              Gota
            </h4>
            <p className="font-roboto text-dark dark:text-light text-[20px]">
              Parámetros específicos que definen las características de cada tipo de gota
            </p>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col">
                <InputNumber
                  label="Fina"
                  valueInitial={configuracionesAvanzadasData.gota.fina}
                  unidad="RPM"
                  required={true}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'gota.fina')}
                />
              </div>
              <div className="flex flex-col">
                <InputNumber
                  label="Media"
                  valueInitial={configuracionesAvanzadasData.gota.media}
                  unidad="RPM"
                  required={true}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'gota.media')}
                />
              </div>
              <div className="flex flex-col">
                <InputNumber
                  label="Gruesa"
                  valueInitial={configuracionesAvanzadasData.gota.gruesa}
                  unidad="RPM"
                  required={true}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'gota.gruesa')}
                />
              </div>
              <div className="flex flex-col">
                <InputNumber
                  label="Custom"
                  valueInitial={configuracionesAvanzadasData.gota.custom}
                  unidad="RPM"
                  required={true}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'gota.custom')}
                />
              </div>
            </div>
          </div>
          <div className=" flex flex-col gap-4">
            <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              Tolerancia de RPM
            </h4>
            <p className="font-roboto text-dark dark:text-light text-[20px]">
              Ajuste de la variabilidad en el funcionamiento de los aspersores
            </p>
            <div className="flex flex-col">
              <InputNumber
                label="Variación +/-"
                valueInitial={configuracionesAvanzadasData.variacionRPM}
                unidad="%"
                required={true}
                onChange={($e) => onChangeConfiguracionesAvanzada($e, 'variacionRPM')}
              />
            </div>
          </div>
          <div className=" flex flex-col gap-4">
            <h4 className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              Corriente de motores
            </h4>
            <p className="font-roboto text-dark dark:text-light text-[20px]">
              Define los valores máximos y mínimos de corriente, así como los límites para
              cortocircuitos, durante el funcionamiento normal de los motores
            </p>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col">
                <InputNumber
                  label="Máximo"
                  valueInitial={configuracionesAvanzadasData.corriente.maximo}
                  unidad="A"
                  required={true}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'corriente.maximo')}
                />
              </div>
              <div className="flex flex-col">
                <InputNumber
                  label="Mínimo"
                  valueInitial={configuracionesAvanzadasData.corriente.minimo}
                  unidad="A"
                  required={true}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'corriente.minimo')}
                />
              </div>
              <div className="flex flex-col">
                <InputNumber
                  label="Límite"
                  valueInitial={configuracionesAvanzadasData.corriente.limite}
                  unidad="A"
                  required={true}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'corriente.limite')}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pt-4">
              <div className="flex gap-4 items-center">
                <label className="font-roboto text-dark dark:text-light text-[20px]">
                  Sensor RPM
                </label>
                <input
                  defaultChecked={configuracionesAvanzadasData.sensorRPM}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'sensorRPM')}
                  className={clsx(
                    'h-[33px] w-[33px] text-2xl appearance-none rounded-[5px] checked:appearance-auto accent-success bg-transparent border border-solid border-dark dark:border-light',
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
                <label className="font-roboto text-dark dark:text-light text-[20px]">
                  Electroválvula
                </label>
                <input
                  defaultChecked={configuracionesAvanzadasData.electroValvula}
                  onChange={($e) => onChangeConfiguracionesAvanzada($e, 'electroValvula')}
                  className={clsx(
                    'h-[33px] w-[33px] text-2xl appearance-none rounded-[5px] checked:appearance-auto accent-success bg-transparent border border-solid border-dark dark:border-light',
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
            <p className="font-roboto text-dark dark:text-light text-[20px]">
              Modifica las especificaciones individuales de cada nodo
            </p>
          </div>
          <div className="w-[180px]">
            <Button type="success" size="md" onClick={() => openModal('buscar-nodos-disponibles')}>
              Escanear
            </Button>
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
            idModal="nodos-disponibles"
            ModalContent={Dialog}
            modalContentProps={{
              title: 'Escaneo completado',
              message: '',
              type: 'success',
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
            idModal="buscar-nodos-disponibles"
            ModalContent={Dialog}
            modalContentProps={{
              title: 'Escanear',
              message: '¿Desea escanear para encontrar los nodos disponibles?',
              type: 'success'
            }}
            closed={modalClosed}
            crossClose
            outsideClose
          />
        </div>
        <div className="w-full h-[500px] rounded-[5px] border border-solid border-success p-12 flex flex-col gap-8">
          <div className="flex flex-col gap-4 h-[380px] flex-wrap">
            {nodos?.map((nodoData, i) => {
              const dataSelect = nodosDisponibles
                ? nodosDisponibles.map((n) => ({
                    id: n,
                    name: `Nodo ${n.toString()}`
                  }))
                : []
              return (
                <div key={i}>
                  <div className="flex justify-around gap-4">
                    <p className="font-roboto text-dark dark:text-light text-[20px]">
                      NODO {nodoData.nombre}:
                    </p>{' '}
                    <Select
                      data={dataSelect}
                      containsValue={nodoData.id !== 0}
                      changeValue={(value) =>
                        setNodos(
                          nodos.map((n) => {
                            if (n.nombre === nodoData.nombre) {
                              n.id = value.id
                            }
                            return n
                          })
                        )
                      }
                      selectedInitial={dataSelect.find((n) => n.id === nodoData.id)}
                    />
                    <Button
                      type="success-light"
                      size="sm"
                      maxWith={false}
                      onClick={() => openModal('configuracion-de-nodo' + i)}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.4278 0C19.5136 0 18.5993 0.348158 17.9014 1.04605L16.4212 2.52632L21.4738 7.57895L22.9541 6.09868C24.3486 4.70416 24.3486 2.44184 22.9541 1.04605C22.2562 0.348158 21.342 0 20.4278 0ZM14.5264 4.42105L0 18.9474V24H5.05267L19.5791 9.47368L14.5264 4.42105Z"
                          fill="#32CF9C"
                        />
                      </svg>
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
                </div>
              )
            })}
          </div>
          <Button
            type="success"
            size="md"
            disabled={!(nodosDisponibles && nodosDisponibles.length > 0)}
            onClick={handleGuardarClick}
          >
            Guardar
          </Button>
          <Modal<{
            title: string
            message: string
            type: 'success' | 'warning' | 'error' | 'default'
            buttons?: {
              cancelar?: {
                noShow?: boolean
                text: string
                type: DialogType
              }
              aceptar?: {
                noShow?: boolean
                text: string
                type: DialogType
              }
            }
          }>
            idModal="guardar-configuracion-nodos"
            ModalContent={Dialog}
            modalContentProps={{
              title: 'Guardar configuración de nodos',
              message: '¿Desea guardar configuración de nodos?',
              type: 'warning',
              buttons: {
                cancelar: {
                  text: 'No',
                  type: 'error'
                },
                aceptar: {
                  text: 'Sí',
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
            idModal="guardo-configuracion"
            ModalContent={Dialog}
            modalContentProps={{
              title: 'Exito',
              message: 'Se guardo satisfactoriamente la configuración',
              type: 'success',
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
          <div
            ref={divRef}
            className={clsx('fixed inset-x-0 bottom-0 z-50', {
              hidden: !showKeyboard
            })}
          >
            <Keyboard
              keyboardRef={(r) => (keyboardRef.current = r)}
              theme="hg-theme-default"
              layout={{
                default: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 {enter}']
              }}
              mergeDisplay
              display={display}
              onChange={setValue}
              onKeyPress={onKeyPress}
              onKeyReleased={() => {
                if (inputRef && inputRef.current) inputRef.current.value = value
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
interface PropsSelect {
  data: DataSelect[]
  selectedInitial: DataSelect | undefined
  containsValue: boolean
  changeValue: (DataSelect) => void
}

function Select({ data, selectedInitial, containsValue, changeValue }: PropsSelect): JSX.Element {
  const [error, setError] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<DataSelect>()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (selectedInitial) {
      setSelected(selectedInitial)
    }
  }, [selectedInitial])

  return (
    <div
      className={clsx('relative flex flex-col min-w-[200px]', {
        'border-error': error,
        'focus:border-error': error,
        'focus-visible:border-error': error
      })}
    >
      <div
        onClick={() => setOpen(!open)}
        className={`bg-light dark:bg-dark w-full flex items-center justify-between rounded-[5px] mr-8 p-4 border border-solid border-dark dark:border-light pl-[18px] text-success font-bold ${
          !selected && 'text-gray-700'
        }`}
      >
        {selected?.name
          ? selected.name?.length > 25
            ? selected.name?.substring(0, 25) + '...'
            : selected.name
          : containsValue
            ? `No conectado`
            : '-'}
        <svg
          width="16"
          height="9"
          viewBox="0 0 16 9"
          className="fill-current text-dark dark:text-light"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.4225 7.67263L15.6677 2.29759C15.8805 2.07819 16 1.78139 16 1.47202C16 1.16265 15.8805 0.865846 15.6677 0.646438C15.5615 0.536679 15.4351 0.449561 15.2958 0.39011C15.1566 0.330658 15.0072 0.300049 14.8563 0.300049C14.7055 0.300049 14.5561 0.330658 14.4169 0.39011C14.2776 0.449561 14.1512 0.536679 14.045 0.646438L8.81122 6.03319C8.70498 6.14295 8.5786 6.23006 8.43934 6.28952C8.30009 6.34897 8.15072 6.37958 7.99987 6.37958C7.84901 6.37958 7.69965 6.34897 7.56039 6.28952C7.42114 6.23006 7.29475 6.14295 7.18852 6.03319L1.95474 0.646438C1.74107 0.425928 1.45067 0.30143 1.14743 0.300332C0.844186 0.299234 0.552936 0.421626 0.337752 0.640583C0.122569 0.85954 0.00107761 1.15713 5.671e-06 1.46788C-0.00106627 1.77862 0.118372 2.07708 0.33204 2.29759L5.57725 7.67263C6.22004 8.33052 7.09138 8.70005 7.99987 8.70005C8.90835 8.70005 9.77969 8.33052 10.4225 7.67263Z" />
        </svg>

        {/* <BiChevronDown size={20} className={`${open && "rotate-180"}`} /> */}
      </div>
      <ul
        className={` absolute z-30 top-[3.3rem] bg-[#172530] rounded-[5px] text-dark dark:text-light mt-2 overflow-y-auto touch-auto w-full ${open ? 'max-h-[140px]' : 'max-h-0'} `}
      >
        {data?.map((value) => (
          <li
            key={value?.name}
            className={`p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-300 hover:dark:bg-sky-600 hover:text-dark dark:text-light
            ${value?.name.toLowerCase() === selected?.name?.toLowerCase() && 'bg-sky-300 hover:dark:bg-sky-600 text-dark dark:text-light'}
            ${value?.name.toLowerCase().startsWith(inputValue) ? 'block' : 'hidden'}`}
            onClick={() => {
              if (value?.name.toLowerCase() !== selected?.name.toLowerCase()) {
                setSelected(value)
                setOpen(false)
                setInputValue('')
                changeValue(value)
              }
            }}
          >
            {value?.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
