import clsx from 'clsx'
import { useToggle } from '../hooks/useToggle'
import { ItemMenu } from './interfaces/item-menu.interface'
import { ItemMenuAside } from './ItemMenuAside'
import { useEffect, useState } from 'react'

export function Aside() {
  const { getStateToggle } = useToggle()

  const [data, setData] = useState<ItemMenu[]>()

  const fetchData = async () => {
    const result = await window.api.invoke.getItemsMenuAsync()
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
      <ul className="mt-[50px] ml-[15px] mr-[21px] ">{items}</ul>
      <div className="mt-[50px] ml-[15px] mr-[21px] bg-warning">
        <svg
          width="20"
          height="19"
          viewBox="0 0 20 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.1778 1.81948C13.1711 2.25129 13.4018 2.65561 13.7877 2.88799C17.2147 4.86347 18.2954 9.08601 16.2015 12.3192C14.1076 15.5524 9.63206 16.5721 6.20503 14.5966C2.778 12.6211 1.69729 8.39857 3.79121 5.16532C4.38951 4.24148 5.21107 3.46432 6.18871 2.8974C6.58117 2.66501 6.81815 2.25744 6.815 1.82028C6.81709 1.10985 6.20835 0.532358 5.45534 0.530388C5.19671 0.529705 4.9432 0.598444 4.72441 0.728607C0.0334977 3.47755 -1.4072 9.29363 1.50645 13.7193C4.4201 18.1449 10.5848 19.5041 15.2756 16.7552C19.9665 14.0063 21.4072 8.19022 18.4935 3.7646C17.6825 2.53272 16.5814 1.49383 15.2756 0.728647C14.6366 0.348329 13.7919 0.52874 13.3887 1.1316C13.251 1.33749 13.1779 1.57599 13.1778 1.81948Z"
            fill="#1C2E3D"
          />
        </svg>
        hola
      </div>
    </aside>
  )
}
