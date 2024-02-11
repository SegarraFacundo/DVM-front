import { Button } from '../../../ui/components/Button'
import { ModalProps } from '../../../ui/components/modal/Modal'

export function EstadoAspersores ({ close, acept }: ModalProps<undefined>) {
  return (
    <div className='flex flex-col gap-10 p-8'>
      <div className='grid grid-cols-2 gap-8'>
        sda
      </div>
      <div className='flex flex-row gap-4 justify-end'>
        <Button type='error' onClick={close}>
          Cancelar
        </Button>
        <Button type='success' onClick={acept}>
          Continuar
        </Button>
      </div>

    </div>
  )
}
