import { useEffect, useState } from 'react'
import { Button } from '../Button'
import { ModalProps } from '../modal/Modal'
import { useBomba } from '@renderer/lib/hooks/UseBomba'


export default function PreparacionBomba({ acept, close }: ModalProps<undefined>): JSX.Element {
  const [percentageLoading, setPercentageLoading] = useState<number>(0)
  const { encendidoApagado } = useBomba()
  useEffect(() => {
    setPercentageLoading(0)

    for (let index = 1; index < 101; index++) {
      setTimeout(() => setPercentageLoading(index), index * 30)
    }
  }, [])

  return (
    <div className="flex flex-col justify-between  w-[800px] h-auto gap-10 bg-light dark:bg-dark boder border-white p-[28px]">
      <div className="flex items-center">
        <div className="mr-[14px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M16 0C12.8355 0 9.74206 0.938383 7.11088 2.69649C4.47969 4.45459 2.42894 6.95344 1.21793 9.87706C0.00693257 12.8007 -0.309921 16.0177 0.307443 19.1214C0.924806 22.2251 2.44866 25.0761 4.6863 27.3137C6.92394 29.5513 9.77486 31.0752 12.8786 31.6926C15.9823 32.3099 19.1993 31.9931 22.1229 30.7821C25.0465 29.5711 27.5454 27.5203 29.3035 24.8891C31.0616 22.2579 32 19.1645 32 16C31.9954 11.7579 30.3082 7.69094 27.3086 4.69136C24.309 1.69177 20.2421 0.00458811 16 0ZM16 29.3333C13.3629 29.3333 10.7851 28.5513 8.5924 27.0862C6.39975 25.6212 4.69078 23.5388 3.68161 21.1024C2.67244 18.6661 2.4084 15.9852 2.92287 13.3988C3.43734 10.8124 4.70721 8.43661 6.57191 6.57191C8.43661 4.70721 10.8124 3.43733 13.3988 2.92286C15.9852 2.40839 18.6661 2.67244 21.1024 3.6816C23.5388 4.69077 25.6212 6.39974 27.0863 8.59239C28.5513 10.785 29.3333 13.3629 29.3333 16C29.3294 19.535 27.9234 22.9241 25.4238 25.4238C22.9242 27.9234 19.535 29.3294 16 29.3333Z"
              fill="#FFC107"
            />
            <path
              d="M15.9998 6.66675C15.6462 6.66675 15.3071 6.80722 15.057 7.05727C14.807 7.30732 14.6665 7.64646 14.6665 8.00008V18.6667C14.6665 19.0204 14.807 19.3595 15.057 19.6096C15.3071 19.8596 15.6462 20.0001 15.9998 20.0001C16.3535 20.0001 16.6926 19.8596 16.9426 19.6096C17.1927 19.3595 17.3332 19.0204 17.3332 18.6667V8.00008C17.3332 7.64646 17.1927 7.30732 16.9426 7.05727C16.6926 6.80722 16.3535 6.66675 15.9998 6.66675Z"
              fill="#FFC107"
            />
            <path
              d="M17.3332 24.0001C17.3332 23.2637 16.7362 22.6667 15.9998 22.6667C15.2635 22.6667 14.6665 23.2637 14.6665 24.0001C14.6665 24.7365 15.2635 25.3334 15.9998 25.3334C16.7362 25.3334 17.3332 24.7365 17.3332 24.0001Z"
              fill="#FFC107"
            />
          </svg>
        </div>
        <h3 className="text-3xl not-italic font-bold text-warning">Preparación de dispositivos</h3>
      </div>
      <div className="flex flex-col gap-10">
        <p className="text-2xl not-italic font-normal text-dark dark:text-light">
          {percentageLoading === 100
            ? `Ahora puede ${encendidoApagado} la bomba.`
            : 'Por favor, aguarde mientras se realiza el proceso de limpieza.'}
        </p>
        {percentageLoading !== 100 && (
          <p className="text-2xl not-italic font-bold text-dark dark:text-light">
            EL INCUMPLIMIENTO DE ESTA ORDEN PUEDE DAÑAR EL EQUIPO
          </p>
        )}
        <section className="flex flex-col gap-2 content-center items-center justify-between">
          <div className="w-full border-2 border-white bg-transparent p-1 rounded-md">
            <div className="bg-white h-2 rounded-sm" style={{ width: percentageLoading + '%' }} />
          </div>

          <div className="w-full flex justify-end">
            <p className="text-[20px] text-dark dark:text-light font-medium">
              {percentageLoading}%
            </p>
          </div>
        </section>
      </div>
      <div className="w-full flex flex-row gap-4 justify-end">
        <Button type="error" onClick={close} maxWith={false}>
          {' '}
          Cancelar
        </Button>
        <Button type="success" onClick={acept} maxWith={false} disabled={percentageLoading !== 100}>
          Aceptar
        </Button>
      </div>
    </div>
  )
}
