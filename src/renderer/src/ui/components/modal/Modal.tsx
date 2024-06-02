// import { CrossIcon } from '@ui/icons'
import { MouseEvent, ReactNode, FC, useEffect } from 'react'
import { useModal } from './hooks/UseModal'

export interface ModalProps<T> {
  props?: T
  close?: () => void
  acept?: () => void
}

interface Props<T> {
  idModal: string
  ModalContent: FC<ModalProps<T>>
  modalContentProps?: T
  crossClose?: boolean
  outsideClose?: boolean
  closed: (idModal: string, acept: boolean) => void
}

export function Modal<T>({
  idModal,
  ModalContent,
  modalContentProps,
  outsideClose,
  closed
}: Props<T>): JSX.Element {
  const { toggleOpenedState, getStateModal } = useModal()

  const onClickOutside = () => {
    closed(idModal, false)
    if (outsideClose !== true) return
    toggleOpenedState(idModal)
  }

  const onEventClose = () => {
    closed(idModal, false)
    toggleOpenedState(idModal)
  }

  const onEventAcept = () => {
    closed(idModal, true)
    toggleOpenedState(idModal)
  }

  useEffect(() => {}, [])

  return (
    <>
      {getStateModal(idModal) && (
        <ModalContainer onClickOutside={onClickOutside}>
          <ModalContent close={onEventClose} acept={onEventAcept} {...modalContentProps} />
        </ModalContainer>
      )}
    </>
  )
}

interface PropsModalContainer {
  onClickOutside?: (event: MouseEvent<HTMLDivElement>) => void
  children: ReactNode
}

export function ModalContainer({ children, onClickOutside }: PropsModalContainer) {
  const handleOnClickOutside = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      event.preventDefault()
      event.stopPropagation()

      if (onClickOutside == null) return

      onClickOutside(event)
    }
  }

  return (
    <div
      onClick={handleOnClickOutside}
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 bottom-0 z-40 w-full p-4 grid place-content-center bg-gray-950/90"
    >
      <div className="relative border-white/30 border-[0.3px] bg-light dark:bg-dark  rounded-md shadow-zinc-950 shadow-lg">
        {children}
      </div>
    </div>
  )
}
