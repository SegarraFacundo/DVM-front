import { useEffect, useRef, useState } from 'react'
import { useTitle } from '../../lib/hooks/UseTitle'
import { ButtonMenu } from './ButtonMenu'
import { useFormInitial } from '../../app/home/components/FormInitial/hooks/UseFormInitial'
import { useCarga } from './hooks/useCarga'
import { useToggle } from '../hooks/useToggle'

export function Header () {
  const { title } = useTitle()
  const [dayCurrent, setDayCurrent] = useState('')
  const { cargando } = useCarga()
  const { addToggle, toggleOpenedState, getStateToggle } = useToggle()
  const { operario, isValid } = useFormInitial()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setDayCurrent(getCurrentDate())
  }, [dayCurrent])

  const getCurrentDate = () => {
    // Days array
    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado'
    ]

    const newDate = new Date()
    const date = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()
    const hours = newDate.getHours()
    const mins = newDate.getMinutes()
    const dayCurrent = newDate.getDay()

    return `${days[dayCurrent]} ${date}/${
      month < 10 ? `0${month}` : `${month}`
    }/${year} - ${hours}:${mins} hs.`
  }

  useEffect(() => {
    addToggle('info-login')

    const closeClick = (e: Event) => {
      // llamo para cerrar
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (e && e.target && buttonRef.current?.contains(e.target)) { return }
      if (getStateToggle('info-login')) toggleOpenedState('info-login')
    }

    window.addEventListener('click', closeClick)

    return () => {
      window.removeEventListener('click', closeClick)
    }
  }, [])

  const handleInfoLoginClick = () => {
    toggleOpenedState('info-login')
  }

  return (
    !cargando &&
      <>
        <ButtonMenu />
        <header className='w-full fixed h-[64px] bg-[#1C2E3D] z-10 pl-[112px] pr-[96px] flex items-center justify-between'>
          <h1 className='text-white font-roboto text-base not-italic'>{title}</h1>
          <div className='flex gap-2 items-center text-white'>
            <span className='mr-[21px] font-roboto text-sm text-success not-italic font-normal'>{operario.name}</span>
            <span className='mr-[21px] font-roboto text-sm text-white not-italic font-normal'>
              {dayCurrent}
            </span>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
              >
                <path
                  d='M8.63967 4.31982C8.06682 4.31982 7.51743 4.54739 7.11236 4.95245C6.7073 5.35752 6.47974 5.90691 6.47974 6.47975V15.1195C6.47974 15.6923 6.7073 16.2417 7.11236 16.6468C7.51743 17.0518 8.06682 17.2794 8.63967 17.2794C9.21252 17.2794 9.7619 17.0518 10.167 16.6468C10.572 16.2417 10.7996 15.6923 10.7996 15.1195V6.47975C10.7996 5.90691 10.572 5.35752 10.167 4.95245C9.7619 4.54739 9.21252 4.31982 8.63967 4.31982Z'
                  fill='#32CF9C'
                />
                <path
                  d='M15.1194 0C14.5466 0 13.9972 0.227563 13.5921 0.632629C13.187 1.03769 12.9595 1.58708 12.9595 2.15993V15.1195C12.9595 15.6924 13.187 16.2417 13.5921 16.6468C13.9972 17.0519 14.5466 17.2794 15.1194 17.2794C15.6923 17.2794 16.2416 17.0519 16.6467 16.6468C17.0518 16.2417 17.2793 15.6924 17.2793 15.1195V2.15993C17.2793 1.58708 17.0518 1.03769 16.6467 0.632629C16.2416 0.227563 15.6923 0 15.1194 0ZM15.8394 15.1195C15.8394 15.3105 15.7635 15.4936 15.6285 15.6286C15.4935 15.7636 15.3104 15.8395 15.1194 15.8395C14.9285 15.8395 14.7453 15.7636 14.6103 15.6286C14.4753 15.4936 14.3994 15.3105 14.3994 15.1195V2.15993C14.3994 1.96898 14.4753 1.78585 14.6103 1.65083C14.7453 1.51581 14.9285 1.43995 15.1194 1.43995C15.3104 1.43995 15.4935 1.51581 15.6285 1.65083C15.7635 1.78585 15.8394 1.96898 15.8394 2.15993V15.1195Z'
                  fill='#32CF9C'
                />
                <path
                  d='M2.15993 8.63965C1.58708 8.63965 1.03769 8.86721 0.632629 9.27228C0.227563 9.67734 0 10.2267 0 10.7996L0 15.1194C0 15.6923 0.227563 16.2417 0.632629 16.6467C1.03769 17.0518 1.58708 17.2794 2.15993 17.2794C2.73278 17.2794 3.28217 17.0518 3.68723 16.6467C4.0923 16.2417 4.31986 15.6923 4.31986 15.1194V10.7996C4.31986 10.2267 4.0923 9.67734 3.68723 9.27228C3.28217 8.86721 2.73278 8.63965 2.15993 8.63965Z'
                  fill='#32CF9C'
                />
              </svg>
            </div>
            {isValid && <button ref={buttonRef} className='ml-10' onClick={handleInfoLoginClick}>
              <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M16 0C7.168 0 0 7.168 0 16C0 24.832 7.168 32 16 32C24.832 32 32 24.832 32 16C32 7.168 24.832 0 16 0ZM8.112 26.048C8.8 24.608 12.992 23.2 16 23.2C19.008 23.2 23.216 24.608 23.888 26.048C21.712 27.776 18.976 28.8 16 28.8C13.024 28.8 10.288 27.776 8.112 26.048ZM26.176 23.728C23.888 20.944 18.336 20 16 20C13.664 20 8.112 20.944 5.824 23.728C4.192 21.584 3.2 18.912 3.2 16C3.2 8.944 8.944 3.2 16 3.2C23.056 3.2 28.8 8.944 28.8 16C28.8 18.912 27.808 21.584 26.176 23.728ZM16 6.4C12.896 6.4 10.4 8.896 10.4 12C10.4 15.104 12.896 17.6 16 17.6C19.104 17.6 21.6 15.104 21.6 12C21.6 8.896 19.104 6.4 16 6.4ZM16 14.4C14.672 14.4 13.6 13.328 13.6 12C13.6 10.672 14.672 9.6 16 9.6C17.328 9.6 18.4 10.672 18.4 12C18.4 13.328 17.328 14.4 16 14.4Z' fill='#32CF9C' />
              </svg>
            </button>}
          </div>
        </header>
      </>
  )
}
