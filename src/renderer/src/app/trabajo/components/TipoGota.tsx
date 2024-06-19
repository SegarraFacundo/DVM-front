import { Button } from '../../../ui/components/Button'
import { ModalProps } from '../../../ui/components/modal/Modal'
import { TipoGotaType, useTipoGota } from '../hooks/useTipoGota'

export function TipoGota ({ close, acept }: ModalProps<undefined>) {
  const { setTipoGota, tipoGotaseleccionada } = useTipoGota()

  const handleClickTipoGotaSeleccionada = (value: TipoGotaType) => {
    setTipoGota(value)
  }

  return (
    <div className='flex flex-col gap-10 p-8'>
      <div className='grid grid-cols-2 gap-8'>
        <Button size='lg' type={tipoGotaseleccionada !== 'FINA' ? 'default-light' : 'success'} onClick={() => handleClickTipoGotaSeleccionada('FINA')}>
          Fina
        </Button>
        <Button size='lg' type={tipoGotaseleccionada !== 'MEDIA' ? 'default-light' : 'success'} onClick={() => handleClickTipoGotaSeleccionada('MEDIA')}>
          Media
        </Button>
        <Button size='lg' type={tipoGotaseleccionada !== 'GRUESA' ? 'default-light' : 'success'} onClick={() => handleClickTipoGotaSeleccionada('GRUESA')}>
          Gruesa
        </Button>
        <Button size='lg' type={tipoGotaseleccionada !== 'CUSTOM' ? 'default-light' : 'success'} onClick={() => handleClickTipoGotaSeleccionada('CUSTOM')}>
          Custom
        </Button>
      </div>
      <div className='flex flex-row gap-4 justify-end'>
        <Button type='error' onClick={close} maxWith={false}>
          Cancelar
        </Button>
        <Button type='success' onClick={acept} disabled={!tipoGotaseleccionada} maxWith={false}>
          Confirmar
        </Button>
      </div>

    </div>
  )
}
