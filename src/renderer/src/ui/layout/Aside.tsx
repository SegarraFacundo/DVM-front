import clsx from 'clsx'
import { useToggle } from '../hooks/useToggle'
import { ItemMenu } from './interfaces/item-menu.interface'
import { ItemMenuAside } from './ItemMenuAside'
import { useEffect, useState } from 'react'

export function Aside () {
  const { getStateToggle } = useToggle()

  const [data, setData] = useState<ItemMenu[]>()

  const fetchData = async () => {
    const result = (await window.api.invoke.getItemsMenuAsync())
    setData(result)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const items = data?.map(function (item, i) {
    return (
      <li key={i}>
        <ItemMenuAside itemMenu={item} />
      </li>
    )
  })

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 z-20 mt-[80px] w-[277px] h-screen transition-transform  bg-success rounded-r-lg dark:bg-success flex flex-col justify-between',
        {
          '-translate-x-full': !getStateToggle('menu-lateral')
        }
      )}
    >
      <ul className='mt-[50px] ml-[15px] mr-[21px] '>
        {items}
      </ul>
    </aside>
  )
}
