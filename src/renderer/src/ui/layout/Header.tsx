import { useEffect, useRef, useState } from 'react'
import { useTitle } from '../../lib/hooks/UseTitle'
import { ButtonMenu } from './ButtonMenu'
import { useFormInitial } from '../../app/home/components/form-initial/hooks/UseFormInitial'
import { useCarga } from './hooks/useCarga'
import { useToggle } from '../hooks/useToggle'

export function Header(): JSX.Element {
  const { title } = useTitle()
  const [dayCurrent, setDayCurrent] = useState('')
  const { cargando } = useCarga()
  const { addToggle, toggleOpenedState, getStateToggle } = useToggle()
  const { operario, isValid } = useFormInitial()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setDayCurrent(getCurrentDate())
  }, [dayCurrent])

  const getCurrentDate = (): string => {
    // Days array
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

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

    const closeClick = (e: Event): void => {
      // llamo para cerrar
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (e && e.target && buttonRef.current?.contains(e.target)) {
        return
      }
      if (getStateToggle('info-login')) toggleOpenedState('info-login')
    }

    window.addEventListener('click', closeClick)

    return () => {
      window.removeEventListener('click', closeClick)
    }
  }, [])

  const handleInfoLoginClick = (): void => {
    toggleOpenedState('info-login')
  }

  return (
    !cargando && (
      <>
        <ButtonMenu />
        <header className="w-full fixed h-[64px] bg-[#999] dark:bg-dark z-10 pl-[112px] pr-[96px] flex items-center justify-between">
          <h1 className="text-black dark:text-light font-roboto text-base not-italic">{title}</h1>
          <div className="flex gap-2 items-center text-dark dark:text-light">
            <span className="mr-[21px] font-roboto text-sm text-success font-bold not-italic dark:font-normal">
              {operario.name}
            </span>
            <span className="mr-[21px] font-roboto text-sm text-black dark:text-light not-italic font-normal">
              {dayCurrent}
            </span>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M8.63967 4.31982C8.06682 4.31982 7.51743 4.54739 7.11236 4.95245C6.7073 5.35752 6.47974 5.90691 6.47974 6.47975V15.1195C6.47974 15.6923 6.7073 16.2417 7.11236 16.6468C7.51743 17.0518 8.06682 17.2794 8.63967 17.2794C9.21252 17.2794 9.7619 17.0518 10.167 16.6468C10.572 16.2417 10.7996 15.6923 10.7996 15.1195V6.47975C10.7996 5.90691 10.572 5.35752 10.167 4.95245C9.7619 4.54739 9.21252 4.31982 8.63967 4.31982Z"
                  fill="#32CF9C"
                />
                <path
                  d="M15.1194 0C14.5466 0 13.9972 0.227563 13.5921 0.632629C13.187 1.03769 12.9595 1.58708 12.9595 2.15993V15.1195C12.9595 15.6924 13.187 16.2417 13.5921 16.6468C13.9972 17.0519 14.5466 17.2794 15.1194 17.2794C15.6923 17.2794 16.2416 17.0519 16.6467 16.6468C17.0518 16.2417 17.2793 15.6924 17.2793 15.1195V2.15993C17.2793 1.58708 17.0518 1.03769 16.6467 0.632629C16.2416 0.227563 15.6923 0 15.1194 0ZM15.8394 15.1195C15.8394 15.3105 15.7635 15.4936 15.6285 15.6286C15.4935 15.7636 15.3104 15.8395 15.1194 15.8395C14.9285 15.8395 14.7453 15.7636 14.6103 15.6286C14.4753 15.4936 14.3994 15.3105 14.3994 15.1195V2.15993C14.3994 1.96898 14.4753 1.78585 14.6103 1.65083C14.7453 1.51581 14.9285 1.43995 15.1194 1.43995C15.3104 1.43995 15.4935 1.51581 15.6285 1.65083C15.7635 1.78585 15.8394 1.96898 15.8394 2.15993V15.1195Z"
                  fill="#32CF9C"
                />
                <path
                  d="M2.15993 8.63965C1.58708 8.63965 1.03769 8.86721 0.632629 9.27228C0.227563 9.67734 0 10.2267 0 10.7996L0 15.1194C0 15.6923 0.227563 16.2417 0.632629 16.6467C1.03769 17.0518 1.58708 17.2794 2.15993 17.2794C2.73278 17.2794 3.28217 17.0518 3.68723 16.6467C4.0923 16.2417 4.31986 15.6923 4.31986 15.1194V10.7996C4.31986 10.2267 4.0923 9.67734 3.68723 9.27228C3.28217 8.86721 2.73278 8.63965 2.15993 8.63965Z"
                  fill="#32CF9C"
                />
              </svg>
            </div>
            <div className="ml-4 relative">
              <svg
                width="25"
                height="27"
                viewBox="0 0 25 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 13.4933L16.1823 9.603C17.1667 8.541 17.7083 7.128 17.7083 5.625C17.7083 4.122 17.1667 2.71013 16.1833 1.64813C15.2 0.586125 13.8917 0 12.5 0C11.1083 0 9.80104 0.586125 8.81667 1.64813C7.83333 2.709 7.29167 4.122 7.29167 5.625C7.29167 7.128 7.83333 8.541 8.82917 9.61537L12.5 13.4933ZM11.026 4.03425C11.4198 3.609 11.9427 3.375 12.5 3.375C13.0573 3.375 13.5792 3.609 13.9729 4.03425C14.3656 4.4595 14.5823 5.02425 14.5823 5.625C14.5823 6.22575 14.3656 6.7905 13.9844 7.20225L12.499 8.77162L11.025 7.21575C10.6323 6.7905 10.4156 6.22575 10.4156 5.625C10.4156 5.02425 10.6323 4.4595 11.025 4.03425H11.026ZM23.15 10.1498C22.9104 8.27325 21.4438 6.85688 19.7073 6.768C19.5448 7.98075 19.1281 9.12488 18.4792 10.1261H19.5385C19.7979 10.1261 20.0187 10.3354 20.0552 10.6121L20.3542 12.9578L10.9323 17.5826L4.80312 11.727L4.94583 10.6121C4.98125 10.3354 5.20312 10.1261 5.4625 10.1261H6.52604C5.87396 9.11925 5.45729 7.97625 5.29479 6.768C3.55833 6.85688 2.09167 8.27325 1.85104 10.1509L0.0145833 24.5194L0 27H25V24.75L23.15 10.1486V10.1498ZM4.29062 15.741L12.5427 23.625H3.28333L4.29062 15.741ZM17.2583 23.625L13.4948 20.0295L20.8 16.443L21.7167 23.6239L17.2583 23.625Z"
                  fill="#32CF9C"
                />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="absolute  top-4 right-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#DC3545" />
                <path
                  d="M6.99756 14V13.0923L10.3364 9.55029C10.7765 9.08903 11.1108 8.68066 11.3394 8.3252C11.5679 7.96549 11.6821 7.57406 11.6821 7.15088C11.6821 6.73193 11.5382 6.368 11.2505 6.05908C10.9627 5.74593 10.5607 5.58936 10.0444 5.58936C9.52816 5.58936 9.0944 5.75651 8.74316 6.09082C8.39193 6.4209 8.21631 6.88005 8.21631 7.46826V7.53174H6.99756V7.46826C6.99756 6.62191 7.28955 5.9279 7.87354 5.38623C8.45752 4.84033 9.18115 4.56738 10.0444 4.56738C10.9035 4.56738 11.5933 4.81917 12.1138 5.32275C12.6385 5.8221 12.9009 6.41032 12.9009 7.0874C12.9009 7.68831 12.7295 8.23421 12.3867 8.7251C12.0482 9.21598 11.6335 9.71533 11.1426 10.2231L8.53369 12.9399H13.1548V14H6.99756Z"
                  fill="#1C2E3D"
                />
              </svg>
            </div>
            <ThemeToggle></ThemeToggle>
            {isValid && (
              <button ref={buttonRef} className="ml-4" onClick={handleInfoLoginClick}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 0C7.168 0 0 7.168 0 16C0 24.832 7.168 32 16 32C24.832 32 32 24.832 32 16C32 7.168 24.832 0 16 0ZM8.112 26.048C8.8 24.608 12.992 23.2 16 23.2C19.008 23.2 23.216 24.608 23.888 26.048C21.712 27.776 18.976 28.8 16 28.8C13.024 28.8 10.288 27.776 8.112 26.048ZM26.176 23.728C23.888 20.944 18.336 20 16 20C13.664 20 8.112 20.944 5.824 23.728C4.192 21.584 3.2 18.912 3.2 16C3.2 8.944 8.944 3.2 16 3.2C23.056 3.2 28.8 8.944 28.8 16C28.8 18.912 27.808 21.584 26.176 23.728ZM16 6.4C12.896 6.4 10.4 8.896 10.4 12C10.4 15.104 12.896 17.6 16 17.6C19.104 17.6 21.6 15.104 21.6 12C21.6 8.896 19.104 6.4 16 6.4ZM16 14.4C14.672 14.4 13.6 13.328 13.6 12C13.6 10.672 14.672 9.6 16 9.6C17.328 9.6 18.4 10.672 18.4 12C18.4 13.328 17.328 14.4 16 14.4Z"
                    fill="#32CF9C"
                  />
                </svg>
              </button>
            )}
            
          </div>
        </header>
      </>
    )
  )
}

function ThemeToggle(): JSX.Element {
  return (
    <div className="flex flex-col justify-center ml-3  cursor-pointer">
      <input
        type="checkbox"
        name="light-switch"
        className="light-switch sr-only cursor-pointer"
        checked={!window.api.invoke.isThemeModeDark()}
      />
      <label
        className="relative p-2 cursor-pointer w-[68px] h-[47px] bg-[#2B465D] rounded-lg flex justify-center items-center"
        onClick={() => window.api.invoke.changeModeTheme()}
        htmlFor="light-switch"
      >
        <svg
          className="dark:hidden cursor-pointer"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-slate-300"
            d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"
          />
          <path
            className="fill-slate-400"
            d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"
          />
        </svg>
        <svg
          className="hidden dark:block cursor-pointer"
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.392 9.24389L20.915 7.97964L22.1776 5.45223L23.4402 7.97964L25.9643 9.24389L23.4413 10.5092L22.1787 13.0366L20.915 10.5092L18.392 9.24389ZM24.3771 17.3342C24.0562 17.3342 23.7424 17.4295 23.4755 17.6081C23.2086 17.7866 23.0006 18.0404 22.8778 18.3374C22.755 18.6343 22.7228 18.961 22.7855 19.2762C22.8481 19.5915 23.0026 19.881 23.2296 20.1083C23.4566 20.3355 23.7457 20.4903 24.0605 20.553C24.3753 20.6157 24.7016 20.5835 24.9982 20.4605C25.2947 20.3375 25.5482 20.1293 25.7265 19.862C25.9048 19.5948 26 19.2806 26 18.9592C26 18.5282 25.829 18.1149 25.5247 17.8102C25.2203 17.5054 24.8075 17.3342 24.3771 17.3342ZM18.9676 13.0009C18.6466 13.0009 18.3329 13.0962 18.066 13.2748C17.7991 13.4533 17.5911 13.7071 17.4683 14.004C17.3454 14.301 17.3133 14.6277 17.3759 14.9429C17.4385 15.2581 17.5931 15.5477 17.8201 15.7749C18.047 16.0022 18.3362 16.157 18.651 16.2197C18.9658 16.2824 19.2921 16.2502 19.5886 16.1272C19.8852 16.0042 20.1386 15.7959 20.317 15.5287C20.4953 15.2615 20.5905 14.9473 20.5905 14.6259C20.5905 14.1949 20.4195 13.7816 20.1151 13.4768C19.8108 13.1721 19.398 13.0009 18.9676 13.0009ZM20.3297 23.7194L22.7099 22.0846L20.0787 20.893C17.1024 19.5529 14.099 16.4231 14.099 12.4592C14.099 8.75531 16.9011 5.83898 19.3008 4.4664L21.8044 3.03423L19.2835 1.63348C17.2615 0.509716 14.9765 -0.052863 12.6646 0.0039085C10.3527 0.06068 8.09798 0.734741 6.13344 1.9564C4.1689 3.17806 2.56589 4.90297 1.49016 6.95279C0.414427 9.00262 -0.0949881 11.3029 0.0145839 13.616C0.124156 15.929 0.848738 18.1707 2.11341 20.1093C3.37809 22.048 5.13696 23.6132 7.20816 24.6432C9.27936 25.6732 11.5877 26.1305 13.8946 25.9679C16.2014 25.8053 18.423 25.0298 20.3297 23.7194ZM15.1463 3.48815C13.8383 4.59483 12.7794 5.96656 12.0394 7.51289C11.2994 9.05923 10.8952 10.745 10.8533 12.4592C10.9087 14.3836 11.4079 16.269 12.3118 17.9681C13.2157 19.6672 14.4998 21.1339 16.0637 22.2536C15.0817 22.5832 14.0528 22.7511 13.0171 22.7509C10.4346 22.7509 7.95794 21.7237 6.13187 19.8952C4.30579 18.0667 3.27991 15.5868 3.27991 13.0009C3.27991 10.415 4.30579 7.93508 6.13187 6.1066C7.95794 4.27812 10.4346 3.2509 13.0171 3.2509C13.7335 3.24983 14.4477 3.32941 15.1463 3.48815Z"
            fill="#32CF9C"
          />
        </svg>

        <span className="sr-only">Switch to light / dark version</span>
      </label>
    </div>
  )
}
