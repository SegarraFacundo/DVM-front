import { DataSelect } from '@renderer/app/home/interfaces/data-select.interface'
import { Button } from '@renderer/ui/components/Button'
import { Dialog } from '@renderer/ui/components/dialog/Dialog'
import { Modal } from '@renderer/ui/components/modal/Modal'
import { useModal } from '@renderer/ui/components/modal/hooks/UseModal'
import { NodoData } from '@renderer/ui/components/nodo/interfaces/nodo-data'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import Keyboard from 'react-simple-keyboard'

const dataSelect: DataSelect[] = [
  {
    id: 1,
    name: 'Ruedas'
  },
  {
    id: 2,
    name: 'No conectado'
  },
  {
    id: 3,
    name: 'Izquierda'
  },
  {
    id: 4,
    name: 'Derecha'
  },
  {
    id: 5,
    name: 'Centro'
  },
  {
    id: 6,
    name: 'Sin asignar'
  }
]

interface Props {
  close?
  acept?
  nodoData: NodoData
}
export function ConfiguracionDeNodo({ close, acept, nodoData }: Props): JSX.Element {
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const [error, setError] = useState<boolean>(false)

  const keyboardRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<string>(nodoData?.id.toString() ?? '')
  const [theme, setTheme] = useState<string>('hg-theme-default')
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)

  const setThemeKeyboard = async (): Promise<void> => {
    const result = await window.api.invoke.isThemeModeDark()
    setTheme(
      result
        ? 'hg-theme-dark hg-theme-numeric-dark hg-layout-numeric-dark numeric-theme-dark'
        : 'hg-theme-default hg-theme-numeric hg-layout-numeric numeric-theme'
    )
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

  const openModal = (idModal: string): void => {
    if (getStateModal(idModal)) return
    toggleOpenedState(idModal)
  }

  const modalClosed = (idModal: string, acept: boolean) => {
    if (acept) {
      if (!getStateModal(idModal)) toggleOpenedState(idModal)
    }
  }

  useEffect(() => {
    addModal('restablecer-configuracion-de-nodo')
  }, [nodoData])

  const onKeyPress = (button: string): void => {
    if (button === '{enter}') {
      setShowKeyboard(false)
    }
    if (button === '{clear}') setValue('')
  }

  const onFocusInput = (): void => {
    setShowKeyboard(true)
    keyboardRef.current.setInput(value)
  }

  const display = {
    '{bksp}': 'Borrar',
    '{enter}': 'Enter',
    '{space}': 'Espacio',
    '{tab}': 'Tab',
    '{lock}': 'Lock',
    '{clear}': 'Limpiar',
    '{shift}': 'Shift'
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <h1 className="font-roboto font-bold text-success text-[32px]">Nodo {nodoData?.nombre}</h1>
      <div className="flex flex-row gap-4">
        <label className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
          Identificación:
        </label>
        <p className="font-roboto font-bold text-white text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">Sin asignar</p>
      </div>
      <div className="grid grid-cols-[min-content_minmax(100px,_1fr)_min-content_minmax(100px,_1fr)] gap-4 items-center">
        {nodoData?.aspersores.map((a) => (
          <>
            <label className="font-roboto font-bold text-white text-[20px] whitespace-nowrap">
              {nodoData?.nombre} - {a.id}
            </label>
            <Select data={dataSelect} />
          </>
        ))}
      </div>
      <div className="flex flex-row gap-4 justify-end">
        <Button type="error-light" onClick={() => openModal('restablecer-configuracion-de-nodo')}>
          Restablecer Configuración
        </Button>
        <Modal<{
          title: string
          message: string
          type: 'success' | 'warning' | 'error' | 'default'
        }>
          idModal="restablecer-configuracion-de-nodo"
          ModalContent={Dialog}
          modalContentProps={{
            title: 'Restablecer configuración de Nodo',
            message: '¿Esta seguro que desea restablecer los valores del Nodo?',
            type: 'warning'
          }}
          closed={modalClosed}
          crossClose
          outsideClose
        />

        <Button type="error" onClick={close}>
          Cancelar
        </Button>
        <Button type="success" onClick={acept}>
          Guardar
        </Button>
      </div>
      <div
        ref={divRef}
        className={clsx('fixed inset-x-0 bottom-0 z-50', {
          hidden: !showKeyboard
        })}
      >
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          theme={theme}
          layout={{
            default: ['1 2 3', '4 5 6', '7 8 9', '{clear} 0 {bksp}']
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
  )
}

interface PropsSelect {
  data: DataSelect[]
}

function Select({ data }: PropsSelect): JSX.Element {
  const [error, setError] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<DataSelect>()
  const [open, setOpen] = useState(false)

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
        className={`bg-dark w-full flex items-center justify-between rounded-[5px] mr-8 p-4 border border-solid border-[#fff] pl-[18px] text-white ${
          !selected && 'text-gray-700'
        }`}
      >
        {selected?.name
          ? selected.name?.length > 25
            ? selected.name?.substring(0, 25) + '...'
            : selected.name
          : `Selecciona ${name}`}
        <svg
          width="16"
          height="9"
          viewBox="0 0 16 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.4225 7.67263L15.6677 2.29759C15.8805 2.07819 16 1.78139 16 1.47202C16 1.16265 15.8805 0.865846 15.6677 0.646438C15.5615 0.536679 15.4351 0.449561 15.2958 0.39011C15.1566 0.330658 15.0072 0.300049 14.8563 0.300049C14.7055 0.300049 14.5561 0.330658 14.4169 0.39011C14.2776 0.449561 14.1512 0.536679 14.045 0.646438L8.81122 6.03319C8.70498 6.14295 8.5786 6.23006 8.43934 6.28952C8.30009 6.34897 8.15072 6.37958 7.99987 6.37958C7.84901 6.37958 7.69965 6.34897 7.56039 6.28952C7.42114 6.23006 7.29475 6.14295 7.18852 6.03319L1.95474 0.646438C1.74107 0.425928 1.45067 0.30143 1.14743 0.300332C0.844186 0.299234 0.552936 0.421626 0.337752 0.640583C0.122569 0.85954 0.00107761 1.15713 5.671e-06 1.46788C-0.00106627 1.77862 0.118372 2.07708 0.33204 2.29759L5.57725 7.67263C6.22004 8.33052 7.09138 8.70005 7.99987 8.70005C8.90835 8.70005 9.77969 8.33052 10.4225 7.67263Z"
            fill="white"
          />
        </svg>

        {/* <BiChevronDown size={20} className={`${open && "rotate-180"}`} /> */}
      </div>
      <ul
        className={` absolute z-30 top-[3.3rem] bg-[#172530] rounded-[5px] text-white mt-2 overflow-y-auto w-full ${open ? 'max-h-[140px]' : 'max-h-0'} `}
      >
        {data?.map((value) => (
          <li
            key={value?.name}
            className={`p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-600 hover:text-white
        ${value?.name?.toLowerCase() === selected?.name?.toLowerCase() && 'bg-sky-600 text-white'}
        ${value?.name?.toLowerCase().startsWith(inputValue) ? 'block' : 'hidden'}`}
            onClick={() => {
              if (value?.name?.toLowerCase() !== selected?.name.toLowerCase()) {
                setSelected(value)
                setOpen(false)
                setInputValue('')
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
