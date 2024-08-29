import { ModalProps } from '../../../../ui/components/modal/Modal'
import { useModal } from '../../../../ui/components/modal/hooks/UseModal'
import { useEffect, useState } from 'react'
import { DataSelect } from '../../interfaces/data-select.interface'
import { DatosMeteorologicos } from '../../interfaces/datos-meteorologicos.interface'
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@renderer/lib/socket/interfaces/socket-client.interface'
import { io, Socket } from 'socket.io-client'
import { InputText } from '@renderer/ui/components/input-text/InputText'
import { InputNumber } from '@renderer/ui/components/input-number/InputNumber'
import { Button } from '@renderer/ui/components/Button'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://127.0.0.1:3000')

interface Props extends ModalProps<undefined> {
  added: (data: DataSelect) => void
}

interface ILote {
  name: string
  superficie: string
  ubicacion: string
  geoposicionamiento: {
    lat: number
    long: number
  }
}
export default function AgregarLote({ added, close }: Props): JSX.Element {
  const { toggleOpenedState } = useModal()
  const [value, setValue] = useState<ILote>({
    name: '',
    superficie: '',
    ubicacion: '',
    geoposicionamiento: {
      lat: 0,
      long: 0
    }
  })
  const [datosMeteorologicos, setDatosMeteorologicos] = useState<DatosMeteorologicos>()

  useEffect(() => {
    socket.on('getDatosMeteorologicos', (res) => setDatosMeteorologicos(res))
  }, [])

  const submit = async ($event): Promise<void> => {
    $event.preventDefault()
    const nuevo: DataSelect = await window.api.invoke.addLoteAsync(value)

    if (nuevo) {
      toggleOpenedState('agregarlote')
      added(nuevo)
    }
  }

  const esFormularioValido = (obj: ILote): boolean => {
    return (
      Object.keys(obj).length > 0 &&
      obj.name !== '' &&
      obj.superficie !== '' &&
      obj.ubicacion !== '' &&
      obj.geoposicionamiento.lat !== undefined &&
      obj.geoposicionamiento.long !== undefined
    )
  }

  const usarUbicacionDelGPSHandle = (): void => {
    setValue({
      ...value,
      geoposicionamiento: {
        lat: datosMeteorologicos?.gpsInfo?.latitud ?? 0,
        long: datosMeteorologicos?.gpsInfo?.longitud ?? 0
      }
    })
  }

  return (
    <form
      className="flex flex-col justify-between w-auto h-auto bg-light dark:bg-dark boder border-white p-[28px]"
      onSubmit={submit}
    >
      <div className="flex items-center">
        <h3 className=" text-3xl not-italic font-bold text-dark dark:text-light">Agregar Lote</h3>
      </div>
      <div className="flex flex-col justify-around ">
        <div className="flex justify-around gap-4">
          <InputText
            label="Nombre"
            required={true}
            onChange={(v) => setValue({ ...value, name: v })}
          />
          <InputText
            label="Superficie"
            unidad="Has"
            required={true}
            onChange={(v) => setValue({ ...value, superficie: v })}
          />
        </div>
        <div className="flex">
          <InputText
            label="Ubicación"
            width="[800px]"
            required={true}
            onChange={(v) => setValue({ ...value, ubicacion: v })}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap mb-[36px] mt-[46px]">
            Geoposicionamiento
          </label>
          <div className="flex items-end justify-between">
            <InputNumber
              label="Latitud"
              width="[180px]"
              valueInitial={value.geoposicionamiento.lat}
              unidad=""
              required={true}
              onChange={(v) =>
                setValue({
                  ...value,
                  geoposicionamiento: {
                    ...value.geoposicionamiento,
                    lat: Number.parseFloat(v)
                  }
                })
              }
            />
            <InputNumber
              label="Longitud"
              width="[180px]"
              valueInitial={value.geoposicionamiento.long}
              unidad=""
              required={true}
              onChange={(v) =>
                setValue({
                  ...value,
                  geoposicionamiento: {
                    ...value.geoposicionamiento,
                    long: Number.parseFloat(v)
                  }
                })
              }
            />
            <div
              onClick={usarUbicacionDelGPSHandle}
              className="flex items-center cursor-pointer justify-center h-[60px] w-[366px] rounded-[5px] bg-white dark:bg-[#2B465D] pl-[18px] text-dark dark:text-success p-4 shadow-2xl dark:shadow-slate-700"
            >
              <p className="mr-2 cursor-pointer">Usar Ubicación actual del GPS</p>
              <svg
                width="30"
                height="32"
                viewBox="0 0 30 32"
                fill="none"
                className="cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 15.992L19.4188 11.3813C20.6 10.1227 21.25 8.448 21.25 6.66667C21.25 4.88533 20.6 3.212 19.42 1.95333C18.24 0.694667 16.67 0 15 0C13.33 0 11.7612 0.694667 10.58 1.95333C9.4 3.21067 8.75 4.88533 8.75 6.66667C8.75 8.448 9.4 10.1227 10.595 11.396L15 15.992ZM13.2312 4.78133C13.7037 4.27733 14.3313 4 15 4C15.6687 4 16.295 4.27733 16.7675 4.78133C17.2388 5.28533 17.4987 5.95467 17.4987 6.66667C17.4987 7.37867 17.2388 8.048 16.7812 8.536L14.9987 10.396L13.23 8.552C12.7587 8.048 12.4987 7.37867 12.4987 6.66667C12.4987 5.95467 12.7587 5.28533 13.23 4.78133H13.2312ZM27.78 12.0293C27.4925 9.80533 25.7325 8.12667 23.6488 8.02133C23.4538 9.45867 22.9537 10.8147 22.175 12.0013H23.4463C23.7575 12.0013 24.0225 12.2493 24.0662 12.5773L24.425 15.3573L13.1187 20.8387L5.76375 13.8987L5.935 12.5773C5.9775 12.2493 6.24375 12.0013 6.555 12.0013H7.83125C7.04875 10.808 6.54875 9.45333 6.35375 8.02133C4.27 8.12667 2.51 9.80533 2.22125 12.0307L0.0175 29.06L0 32H30V29.3333L27.78 12.028V12.0293ZM5.14875 18.656L15.0513 28H3.94L5.14875 18.656ZM20.71 28L16.1938 23.7387L24.96 19.488L26.06 27.9987L20.71 28Z"
                  fill="#32CF9C"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row mt-8 gap-4 justify-end">
        <Button type="error" onClick={close} maxWith={false}>
          Cancelar
        </Button>
        <Button
          type="success"
          onClick={submit}
          maxWith={false}
          disabled={!esFormularioValido(value)}
        >
          Agregar
        </Button>
      </div>
    </form>
  )
}
