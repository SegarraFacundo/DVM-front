import { useEffect, useState } from 'react'
import { useTitle } from '../../lib/hooks/UseTitle'
import { ItemInfo } from './components/ItemInfo'
import { ItemInfoData } from './interfaces/item-info.interface'
import { Modal } from '../../ui/components/modal/Modal'
import { FormInitial } from './components/form-initial/FormInitial'
import { useModal } from '../../ui/components/modal/hooks/UseModal'
import { Dialog } from '../../ui/components/dialog/Dialog'
import { useNavigate } from 'react-router-dom'
import { useFormInitial } from './components/form-initial/hooks/UseFormInitial'
import { Button } from '@renderer/ui/components/Button'
import log from 'electron-log/renderer'
import { useOperario } from '@renderer/lib/hooks/UseOperario'

function Home() {
  const navigate = useNavigate()
  const { setTitle } = useTitle()
  const [data, setData] = useState<ItemInfoData[]>()
  const { getStateModal, addModal, toggleOpenedState } = useModal()
  const { operario } = useOperario()
  const { isValid } = useFormInitial()

  useEffect(() => {}, [])

  const fetchData = async () => {
    const result = await window.api.invoke.getItemsInfoAsync()
    setData(result)
  }

  useEffect(() => {
    addModal('init-testing')
    setTitle('Inicio Aplicación')
    fetchData()
  }, [])

  const items = data?.map(function (item, i) {
    return <ItemInfo key={i} data={item} />
  })

  const handleClick = () => {
    if (getStateModal('init-testing')) return
    if (isValid) {
      toggleOpenedState('init-testing')
    }
  }

  const modalClosed = (idModal: string, acept: boolean): void => {
    if (acept) {
      log.info(`Operario ${operario.name} inicio testing`)
      navigate('/testing')
    }
  }

  return (
    <article className="w-full flex flex-col content-center justify-around h-[100%] px-20">
      <section className="flex flex-row content-center items-center justify-between">
        <FormInitial props={{ openedModal: false }} />
        <section className="bg-dark w-[480px] h-[528px] flex flex-col justify-evenly">
          {items}
        </section>
      </section>
      <section className="self-end">
        <Button onClick={handleClick} type="success" size="lg" disabled={!isValid}>
          Iniciar Testing
        </Button>
        <Modal<{
          title: string
          message: string
          type: 'success' | 'warning' | 'error' | 'default'
        }>
          idModal="init-testing"
          ModalContent={Dialog}
          modalContentProps={{
            title: 'Importante',
            message:
              'Las condiciones meteorológicas actuales no son <br /> las adecuadas para continuar con el trabajo <br /><br /> Al aceptar se iniciará el testeo de los aspersores',
            type: 'warning'
          }}
          closed={modalClosed}
          crossClose
          outsideClose
        />
      </section>
    </article>
  )
}

export default Home
