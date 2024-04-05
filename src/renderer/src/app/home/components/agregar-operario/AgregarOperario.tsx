import { useForm } from 'react-hook-form'
import { Button } from '../../../../ui/components/Button'
import { InputText } from '../../../../ui/components/input-text/InputText'
import { ModalProps } from '../../../../ui/components/modal/Modal'
import { useModal } from '../../../../ui/components/modal/hooks/UseModal'

export default function AgregarOperario({ close }: ModalProps<undefined>) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { toggleOpenedState } = useModal()

  const submit = () => {
    toggleOpenedState('agregar-operario')
  }

  return (

    <form className='flex flex-col justify-between w-auto h-auto bg-dark boder border-white p-[28px]' onSubmit={handleSubmit(submit)}>

      <div className='flex items-center'>
        <h3 className=' text-3xl not-italic font-bold text-white'>Agregar Operario</h3>
      </div>
      <div>
        <InputText label='Nombre y apellido' name='lote' register={register} errors={errors} options={{ required: true }} />
        <InputText label='Identificación' name='lote' register={register} errors={errors} options={{ required: true }} />
      </div>
      <div className='w-full flex flex-row mt-8 gap-4 justify-end'>
        <Button type='error' onClick={close} maxWith={false}>
          Cancelar
        </Button>
        <Button type='success' onClick={handleSubmit(submit)} maxWith={false}>
          Agregar
        </Button>
      </div>
    </form>
  )
}
