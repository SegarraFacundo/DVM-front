import clsx from 'clsx'
import { useToggle } from '../../../ui/hooks/useToggle'
import { useEffect, useRef } from 'react'

const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}
export function PanelLateralIzquierdo() {
  const { getStateToggle, addToggle, toggleOpenedState } = useToggle()
  const divContenidoRef = useRef<HTMLDivElement>(null)
  const divPestaniaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    addToggle('panel-lateral-izquierdo')

    const closeClick = (e: Event) => {
      if (
        e.target &&
        (divPestaniaRef.current?.contains(e.target) || divContenidoRef.current?.contains(e.target))
      ) {
        return
      }
      if (getStateToggle('panel-lateral-izquierdo')) toggleOpenedState('panel-lateral-izquierdo')
    }

    window.addEventListener('click', closeClick)

    return () => {
      window.removeEventListener('click', closeClick)
    }
  }, [])

  const handleClickPanel = () => {
    toggleOpenedState('panel-lateral-izquierdo')
  }

  return (
    <>
      {getStateToggle('panel-lateral-izquierdo') && (
        <div className="fixed z-30 top-0 left-0 w-full h-full bg-black opacity-50"></div>
      )}
      <div
        ref={divContenidoRef}
        className={clsx(
          'w-[294px] h-[489px] fixed z-40 left-0 top-[50%] translate-y-[-50%] bg-light dark:bg-dark rounded-r-lg flex items-center justify-center flex-col gap-4 transition-transform',
          {
            '-translate-x-[294px]': !getStateToggle('panel-lateral-izquierdo')
          }
        )}
      >
        <div className="border-[1px] border-dark dark:border-light w-[197px] h-[122px] rounded-lg p-3 flex flex-col">
          <p className="text-success text-[16px] font-bold">Superficie</p>
          <div className="text-dark dark:text-light font-bold flex justify-center align-baseline">
            <h1 className="text-[48px]">
              00<span className="text-[20px]">Has</span>
            </h1>
          </div>
        </div>
        <div className="border-[1px] border-dark dark:border-light w-[197px] h-[122px] rounded-lg p-3 flex flex-col">
          <p className="text-success text-[16px] font-bold">Volúmen x área</p>
          <div className="text-dark dark:text-light font-bold flex justify-center align-baseline">
            <h1 className="text-[48px]">
              00<span className="text-[20px]">Has</span>
            </h1>
          </div>
        </div>
        <div className="border-[1px] border-dark dark:border-light w-[197px] h-[122px] rounded-lg p-3 flex flex-col">
          <p className="text-success text-[16px] font-bold">Velocidad</p>
          <div className="text-dark dark:text-light font-bold flex justify-center align-baseline">
            <h1 className="text-[48px]">
              00<span className="text-[20px]">Has</span>
            </h1>
          </div>
        </div>
      </div>
      <div
        ref={divPestaniaRef}
        onClick={handleClickPanel}
        className={clsx(
          'fixed z-40 left-0 top-[50%] w-[32px] h-[256px] translate-y-[-50%] bg-success rounded-r-lg flex items-center justify-center transition-transform',
          {
            'translate-x-[294px]': getStateToggle('panel-lateral-izquierdo')
          }
        )}
      >
        {!getStateToggle('panel-lateral-izquierdo') ? (
          <svg
            width="12"
            height="21"
            viewBox="0 0 12 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-6.93985e-08 19.4123L-8.48541e-07 1.58765C0.0013109 1.27234 0.0953627 0.964491 0.270262 0.703047C0.445162 0.441601 0.693056 0.238296 0.982595 0.118841C1.27213 -0.000616129 1.59032 -0.0308629 1.89691 0.0319308C2.20351 0.0947246 2.48474 0.247736 2.70505 0.471615L11.5321 9.36802C11.6803 9.51623 11.798 9.69257 11.8783 9.88685C11.9587 10.0811 12 10.2895 12 10.5C12 10.7105 11.9587 10.9189 11.8783 11.1131C11.798 11.3074 11.6803 11.4838 11.5321 11.632L2.70505 20.5284C2.48474 20.7523 2.20351 20.9053 1.89691 20.9681C1.59032 21.0309 1.27214 21.0006 0.982596 20.8812C0.693056 20.7617 0.445163 20.5584 0.270263 20.297C0.0953636 20.0355 0.00131171 19.7277 -6.93985e-08 19.4123Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            width="12"
            height="21"
            viewBox="0 0 12 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1.58765L12 19.4123C11.9987 19.7277 11.9046 20.0355 11.7297 20.297C11.5548 20.5584 11.3069 20.7617 11.0174 20.8812C10.7279 21.0006 10.4097 21.0309 10.1031 20.9681C9.7965 20.9053 9.51526 20.7523 9.29495 20.5284L0.467927 11.632C0.319658 11.4838 0.201973 11.3074 0.121662 11.1131C0.0413515 10.9189 3.90775e-06 10.7105 3.86844e-06 10.5C3.82913e-06 10.2895 0.0413513 10.0811 0.121662 9.88686C0.201973 9.69257 0.319657 9.51624 0.467927 9.36802L9.29495 0.471618C9.51526 0.247738 9.79649 0.094728 10.1031 0.0319347C10.4097 -0.0308587 10.7279 -0.00061536 11.0174 0.118841C11.3069 0.238298 11.5548 0.441603 11.7297 0.703048C11.9046 0.964493 11.9987 1.27234 12 1.58765Z"
              fill="white"
            />
          </svg>
        )}
      </div>
    </>
  )
}
