import { useEffect, useRef, useState } from 'react'
import { FieldErrors, RegisterOptions, UseFormRegister } from 'react-hook-form'
import clsx from 'clsx'
import { useModal } from '../modal/hooks/UseModal'
import { useFormInitial } from '@renderer/app/home/components/form-initial/hooks/UseFormInitial'
import { Modal } from '../modal/Modal'
import AgregarOperario from '@renderer/app/home/components/agregar/AgregarOperario'
import log from 'electron-log/renderer'
import { useOperario } from '@renderer/lib/hooks/UseOperario'
import AgregarLote from '@renderer/app/home/components/agregar/AgregarLote'
import AgregarAplicacion from '@renderer/app/home/components/agregar/AgregarAplicacion'

interface Props {
  label: string
  name: 'operario' | 'lote' | 'tipoAplicacion'
  data: any[]
  options?: RegisterOptions
  register: UseFormRegister<Record<string, number>>
  errors?: FieldErrors
  withAdd?: boolean
}

const InputDropdown = ({ label, name, data, errors, withAdd = false }: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<any>()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<JSX.Element[]>([])
  const [dataSelect, setDataSelect] = useState<any[]>([])
  const { setOperario } = useOperario()

  const { setFormInitial, isValid, operario, lote, tipoAplicacion } = useFormInitial()

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => setDataSelect(data), [data])
  useEffect(() => {
    if (selected) {
      const nuevoEstado = {
        isValid,
        operario,
        lote,
        tipoAplicacion
      }
      switch (name) {
        case 'operario': {
          nuevoEstado.operario = { id: selected?.id, name: selected?.name }
          log.info(`Operario seleccionado ${selected?.name ?? ''}`)
          setOperario(nuevoEstado.operario)
          break
        }
        case 'tipoAplicacion':
          nuevoEstado.tipoAplicacion = { ...selected }
          log.info(`Tipo de aplicación seleccionado ${selected?.name ?? ''}`)
          break
        case 'lote':
          nuevoEstado.lote = { ...selected }
          log.info(`Lote seleccionado ${selected?.name ?? ''}`)
          break
      }

      ;(nuevoEstado.isValid =
        nuevoEstado.operario.id != -1 &&
        nuevoEstado.tipoAplicacion.id != -1 &&
        nuevoEstado.lote.id != -1),
        setFormInitial(nuevoEstado)
    }
  }, [selected])

  useEffect(() => {
    setItems(
      dataSelect?.map((value) => (
        <li
          key={value?.name}
          className={`p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-300 hover:dark:bg-sky-600 hover:text-dark dark:text-light
        ${value?.name?.toLowerCase() === selected?.name?.toLowerCase() && 'bg-sky-300 hover:dark:bg-sky-600 text-dark dark:text-light'}
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
      ))
    )
  }, [dataSelect])

  useEffect(() => {
    const handleClickOutside = (event): void => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return (
    <div
      className={clsx('relative flex flex-col min-w-[400px]', {
        'border-error': errors && errors[name],
        'focus:border-error': errors && errors[name],
        'focus-visible:border-error': errors && errors[name]
      })}
      ref={divRef}
    >
      <label className="font-roboto font-bold text-dark dark:text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap mb-[13px]">
        {label}
      </label>
      <div
        onClick={() => setOpen(!open)}
        className={`bg-light dark:bg-dark w-full flex items-center justify-between rounded-[5px] mr-8 p-4 border border-solid border-dark dark:border-light pl-[18px] text-dark dark:text-light ${
          !selected && 'text-gray-700'
        }`}
      >
        {selected?.name
          ? selected.name?.length > 25
            ? selected.name?.substring(0, 25) + '...'
            : selected.name
          : `Selecciona ${name !== 'tipoAplicacion' ? name : 'tipo de aplicación'}`}
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
        className={` absolute z-30 top-[5.5rem] bg-light dark:bg-dark rounded-[5px] text-dark dark:text-light  border-dark dark:border-light mt-2 overflow-y-auto w-full ${open ? 'max-h-[140px] border-[1px] shadow-lg' : 'max-h-0'} `}
      >
        {withAdd && (
          <OpcionNuevo
            name={name}
            added={(value) => {
              setDataSelect([...dataSelect, value])
              setSelected(value)
              setOpen(false)
            }}
          />
        )}
        {items}
      </ul>
    </div>
  )
}

interface PropsOpcionNuevo {
  added: (data: any) => void
  name: 'operario' | 'lote' | 'tipoAplicacion'
}

function OpcionNuevo({ added, name }: PropsOpcionNuevo): JSX.Element {
  const { addModal, toggleOpenedState } = useModal()
  useEffect(() => {
    addModal('agregar' + name)
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    toggleOpenedState('agregar' + name)
    event.preventDefault()
  }

  const modalClosed = (): void => {}

  return (
    <li className="flex justify-between items-center text-sm border-b-[1px] border-b-success px-[30px] h-[80px] hover:bg-sky-300 hover:dark:bg-sky-600 text-success font-bold">
      Agregar {name !== 'tipoAplicacion' ? name : 'tipo de aplicación'}
      <div className="">
        <button
          onClick={handleClick}
          className="text-dark dark:text-light bg-success p-2 text-lg rounded-md px-4 m-0"
        >
          +
        </button>
      </div>
      {name == 'lote' && (
        <Modal<{
          added
        }>
          idModal={'agregarlote'}
          ModalContent={AgregarLote}
          modalContentProps={{ added }}
          crossClose
          closed={modalClosed}
        />
      )}
      {name == 'tipoAplicacion' && (
        <Modal<{
          added
        }>
          idModal={'agregartipoAplicacion'}
          ModalContent={AgregarAplicacion}
          modalContentProps={{ added }}
          crossClose
          closed={modalClosed}
        />
      )}
      {name == 'operario' && (
        <Modal<{
          added
        }>
          idModal={'agregaroperario'}
          ModalContent={AgregarOperario}
          modalContentProps={{ added }}
          crossClose
          closed={modalClosed}
        />
      )}
    </li>
  )
}

export default InputDropdown
