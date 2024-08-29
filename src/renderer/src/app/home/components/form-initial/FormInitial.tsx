import { useEffect, useState } from 'react'
import { DataSelect } from '../../interfaces/data-select.interface'
import { useFormInitial } from './hooks/UseFormInitial'
import { ModalProps } from '../../../../ui/components/modal/Modal'
import { useForm } from 'react-hook-form'
import { Button } from '../../../../ui/components/Button'
import clsx from 'clsx'
import InputDropdown from '@renderer/ui/components/input-dropdown/InputDropdown'

interface Props extends ModalProps<{ openedModal: boolean }> {}
export function FormInitial({ close, acept, props }: Props): JSX.Element {
  const {
    register,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const [operarios, setOperarios] = useState<DataSelect[]>([])
  const [lotes, setLotes] = useState<any[]>([])
  const [tiposAplicaciones, setTiposAplicaciones] = useState<DataSelect[]>([])

  const fetchOperarios = async (): Promise<void> => {
    const result = await window.api.invoke.getOperariosAsync()
    setOperarios(result)
  }

  const fetchLotes = async (): Promise<void> => {
    const result = await window.api.invoke.getLotesAsync()
    setLotes(result)
  }

  const fetchTiposAplicaciones = async (): Promise<void> => {
    const result = await window.api.invoke.getTiposAplicacionesAsync()
    setTiposAplicaciones(result)
  }

  useEffect(() => {
    fetchOperarios()
    fetchLotes()
    fetchTiposAplicaciones()
  }, [])

  const { setFormInitial } = useFormInitial()

  const handleChange = (): void => {
    const dataForm = getValues()
    setFormInitial({
      isValid: dataForm.operario && dataForm.tipoAplicacion && dataForm.lote,
      operario: {
        id: dataForm.operario,
        name: operarios.find((i) => i.id === dataForm.operario)?.name ?? ''
      },
      lote: {
        id: dataForm.lote,
        ...lotes.find((i) => i.id === dataForm.lote)
      },
      tipoAplicacion: {
        id: dataForm.tipoAplicacion,
        name: tiposAplicaciones.find((i) => i.id === dataForm.tipoAplicacion)?.name ?? ''
      }
    })
  }

  return (
    <form
      className={clsx('flex flex-col justify-between w-auto h-auto boder border-white p-[28px]', {
        'bg-light dark:bg-dark': props?.openedModal
      })}
      onChange={handleChange}
    >
      <div className="flex flex-col gap-4">
        <InputDropdown
          label="Identificación Operario"
          data={operarios}
          name="operario"
          register={register}
          withAdd
          errors={errors}
          options={{ required: true }}
        />
        <InputDropdown
          label="Identificación Lote"
          data={lotes}
          name="lote"
          register={register}
          withAdd
          errors={errors}
          options={{ required: true }}
        />
        <InputDropdown
          label="Tipo de Aplicación"
          data={tiposAplicaciones}
          name="tipoAplicacion"
          register={register}
          withAdd
          errors={errors}
          options={{ required: true }}
        />
      </div>
      {props?.openedModal && (
        <div className="w-full flex flex-row mt-8 gap-4 justify-end">
          <Button type="error" onClick={close}>
            Cancelar
          </Button>
          <Button type="success" onClick={acept}>
            Agregar
          </Button>
        </div>
      )}
    </form>
  )
}
