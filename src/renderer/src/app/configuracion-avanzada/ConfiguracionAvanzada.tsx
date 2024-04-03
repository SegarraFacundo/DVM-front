import { useTitle } from '@renderer/lib/hooks/UseTitle'
import { Button } from '@renderer/ui/components/Button'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import showPassword from './icons/eye.svg'
import hidePasword from './icons/hidden.svg'

const PASSWORD_CONFIGURACION_AVANZADA = '2024.C0NFIGURACI0N'

export default function ConfiguracionAvanzada(): JSX.Element {
  const { setTitle } = useTitle()
  const [passwordType, setPasswordType] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [estaHabilitado, setEstaHabilitado] = useState<boolean>(false)

  useEffect(() => {
    setTitle('Configuración Avanzada')
  }, [])

  const handleIngresarClick = (): void => {
    console.log(inputRef.current ? inputRef.current.value : 'Sin valor')
    if (inputRef.current && PASSWORD_CONFIGURACION_AVANZADA === inputRef.current.value) {
      setError(false)
      setEstaHabilitado(true)
    } else {
      setError(true)
      setEstaHabilitado(false)
    }
  }

  return (
    <article className="w-full flex flex-col justify-center items-center content-center h-[100%] px-20 gap-8">
      {!estaHabilitado && (
        <div className="flex flex-col mt-[46px] relative">
          <label className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap mb-[13px]">
            Contraseña
          </label>
          <input
            className={clsx(
              'h-[64px] w-[366px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
              {
                'border-error': error,
                'focus:border-error': error,
                'focus-visible:border-error': error
              }
            )}
            type={passwordType ? 'password' : 'text'}
            ref={inputRef}
          />
          <div onClick={() => setPasswordType((prev) => !prev)}>
            {passwordType ? (
              <img
                className="absolute cursor-pointer top-[60%] right-[5px] -translate-x-2/4"
                src={showPassword}
                alt="Hide"
              />
            ) : (
              <img
                className="absolute cursor-pointer top-[55%] right-[5px] -translate-x-2/4"
                src={hidePasword}
                alt="Show"
              />
            )}
          </div>
          {error && <p className='absolute top-[150%] text-white font-[20px]'>Contraseña incorrecta. Inténtelo nuevamente.</p>}
        </div>
      )}
      {estaHabilitado && (
        <div>
          <p>Entro</p>
        </div>
      )}
      <div className="flex w-full h-full items-end justify-end mb-10">
        <Button type="success" size="lg" maxWith={false} onClick={handleIngresarClick}>
          Ingresar
        </Button>
      </div>
    </article>
  )
}
