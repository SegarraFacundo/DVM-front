import { useTitle } from '@renderer/lib/hooks/UseTitle'
import { Button } from '@renderer/ui/components/Button'
import { useEffect, useState } from 'react'

export default function ConfiguracionGeneral(): JSX.Element {
  const { setTitle } = useTitle()
  const [percentageLoading, setPercentageLoading] = useState<number>(0)

  const fetchBrilloActual = async (): Promise<void> => {
    const brilloActual = await window.api.invoke.getBrilloActual()
    setPercentageLoading(brilloActual)
  }

  useEffect(() =>  {
    setTitle('Configuración General')
    fetchBrilloActual()
  }, [])
  const handleClickTop = (): void => {
    const porcentaje = percentageLoading === 100 ? 100 : percentageLoading + 10
    setPercentageLoading(porcentaje)
    window.api.invoke.setBrillo(porcentaje)
  }
  const handleClickDown = (): void => {
    const porcentaje = percentageLoading === 0 ? 0 : percentageLoading - 10
    setPercentageLoading(porcentaje)
    window.api.invoke.setBrillo(porcentaje)
  }

  return (
    <article className="w-full flex flex-col content-center justify-around h-[100%] px-20">
      <h1>Retroiluminación</h1>
      <section className="flex gap-2 content-center items-center justify-between">
        <Button onClick={handleClickDown} type="success" size="sm" maxWith={false}>
          <small className="text-white text-[28px]">{'<'}</small>
        </Button>
        <div className='w-full'>
        <div className="w-full border-2 border-white bg-transparent p-1 rounded-md">
          <div className="bg-white h-2 rounded-sm" style={{ width: percentageLoading + '%' }} />
        </div>
        <div className="w-full flex justify-end">
          <p className="text-[20px] text-white font-medium">ILUMINACIÓN {percentageLoading}%</p>
        </div>
        </div>
        <Button onClick={handleClickTop} type="success" size="sm" maxWith={false}>
          <small className="text-white text-[28px]">{'>'}</small>
        </Button>
      </section>
      <h1>Unidad de medida</h1>
      <div className="flex">
        <div className="flex">
          <label className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap mb-[13px]">
            Velocida
          </label>
          <div className="relative flex flex-col min-w-[300px]">
            <div className="bg-dark w-full flex items-center justify-between rounded-[5px] mr-8 p-4 border border-solid border-[#fff] pl-[18px] text-white">
              <svg
                width="16"
                height="9"
                viewBox="0 0 16 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4225 7.67263L15.6677 2.29759C15.8805 2.07819 16 1.78139 16 1.47202C16 1.16265 15.8805 0.865846 15.6677 0.646438C15.5615 0.536679 15.4351 0.449561 15.2958 0.39011C15.1566 0.330658 15.0072 0.300049 14.8563 0.300049C14.7055 0.300049 14.5561 0.330658 14.4169 0.39011C14.2776 0.449561 14.1512 0.536679 14.045 0.646438L8.81122 6.03319C8.70498 6.14295 8.5786 6.23006 8.43934 6.28952C8.30009 6.34897 8.15072 6.37958 7.99987 6.37958C7.84901 6.37958 7.69965 6.34897 7.56039 6.28952C7.42114 6.23006 7.29475 6.14295 7.18852 6.03319L1.95474 0.646438C1.74107 0.425928 1.45067 0.30143 1.14743 0.300332C0.844186 0.299234 0.552936 0.421626 0.337752 0.640583C0.122569 0.85954 0.00107761 1.15713 5.671e-06 1.46788C-0.00106627 1.77862 0.118372 2.07708 0.33204 2.29759L5.57725 7.67263C6.22004 8.33052 7.09138 8.70005 7.99987 8.70005C8.90835 8.70005 9.77969 8.33052 10.4225 7.67263Z"
                  fill="white"
                />
              </svg>

              {/* <BiChevronDown size={20} className={`${open && "rotate-180"}`} /> */}
            </div>
            <ul className="absolute z-30 top-[5.5rem] bg-dark rounded-[5px] text-white mt-2 overflow-y-auto w-full max-h-[140px]">
              <li
                key={1}
                className="p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-600 hover:text-white"
              >
                Km/h
              </li>
              <li
                key={2}
                className="p-2 text-sm border-b-[1px] border-b-success px-[30px] py-[20px] hover:bg-sky-600 hover:text-white"
              >
                mi/h
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button type="success" size="lg" maxWith={false}>
          Guardar
        </Button>
      </div>
    </article>
  )
}
