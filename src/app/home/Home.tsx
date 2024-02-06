import { useEffect, useState } from 'react'
import { useTitle } from '../../lib/hooks/UseTitle'
import { ItemInfo } from './components/ItemInfo'
import { ItemInfoData } from './interfaces/item-info.interface'
import { Modal } from '../../ui/components/modal/Modal'
import { FormInitial } from './components/FormInitial/FormInitial'
import clsx from 'clsx'
import { useModal } from '../../ui/components/modal/hooks/UseModal'
import { Dialog, DialogProps } from '../../ui/components/dialog/Dialog'
import { useNavigate } from 'react-router-dom'
import { useFormInitial } from './components/FormInitial/hooks/UseFormInitial'

function Home () {
  const navigate = useNavigate()
  const { setTitle } = useTitle()
  const [data, setData] = useState<ItemInfoData[]>()
  const { getStateModal, addModal, toggleOpenedState } = useModal()

  const { isValid } = useFormInitial()

  const fetchData = async () => {
    const response = await fetch('/data/items-info.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    const result = await response.json()
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

  const modalClosed = (acept: boolean) => {
    if (acept) { navigate('/') }
  }

  return (
    <article
      className='w-full flex flex-col content-center justify-around h-[100%] px-20'
    >
      <section className='flex flex-row content-center items-center justify-between'>
        <FormInitial />
        <section className='bg-[#1C2E3D] w-[480px] h-[528px] flex flex-col justify-evenly'>
          {items}
        </section>
      </section>
      <section className='self-end'>
        <button
          onClick={handleClick}
          className={clsx('bg-success text-[24px] font-roboto text-[#1C2E3D] w-[271px] h-[82px]',
            {
              'bg-success/50': !isValid
            }
          )}
        >
          Iniciar Testing
        </button>
        <Modal<DialogProps>
          idModal='init-testing'
          ModalContent={Dialog}
          modalContentProps={{
            title: 'Iniciar Testeo',
            message: '¿Confirma iniciar el testeo de los aspersores?',
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
