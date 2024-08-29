import { Button } from '../../../../ui/components/Button'
import { InputText } from '../../../../ui/components/input-text/InputText'
import { ModalProps } from '../../../../ui/components/modal/Modal'
import { useModal } from '../../../../ui/components/modal/hooks/UseModal'
import { useState } from 'react'
import { DataSelect } from '../../interfaces/data-select.interface'

interface Props extends ModalProps<undefined> {
  added: (data: DataSelect) => void
}
export default function AgregarOperario({ added, close }: Props): JSX.Element {
  const { toggleOpenedState } = useModal()
  const [value, setValue] = useState<string>()

  const submit = async ($event): Promise<void> => {
    $event.preventDefault()
    const nuevo: DataSelect = await window.api.invoke.addOperarioAsync(value)

    if (nuevo) {
      toggleOpenedState('agregaroperario')
      added(nuevo)
    }
  }

  return (
    <form
      className="flex flex-col justify-between w-auto h-auto bg-light dark:bg-dark boder border-white p-[28px]"
      onSubmit={submit}
    >
      <div className="flex items-center">
        <h3 className=" text-3xl not-italic font-bold text-dark dark:text-light">
          Agregar operario
        </h3>
      </div>
      <InputText label="Identificador" required={true} onChange={setValue} />
      <div className="w-full flex flex-row mt-8 gap-4 justify-end">
        <Button type="error" onClick={close} maxWith={false}>
          Cancelar
        </Button>
        <Button
          type="success"
          onClick={submit}
          maxWith={false}
          disabled={!(value && value?.length > 2)}
        >
          Agregar
        </Button>
      </div>
    </form>
  )
}
