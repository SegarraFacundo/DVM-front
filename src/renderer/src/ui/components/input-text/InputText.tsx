import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Keyboard from 'react-simple-keyboard'

interface Props {
  label: string
  required?: boolean
  onChange: (input: string, e?: MouseEvent) => void
  width?: string
  unidad?
}

export function InputText({
  label,
  required,
  onChange,
  width = '[366px]',
  unidad = ''
}: Props): JSX.Element {
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>('')
  const divRef = useRef<HTMLDivElement>(null)
  const keyboardRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event): void => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        divRef.current &&
        !divRef.current.contains(event.target)
      ) {
        setShowKeyboard(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  const onKeyPress = (button: string): void => {
    if (button === '{enter}') {
      setShowKeyboard(false)
    }
  }

  const onFocusInput = (): void => {
    setShowKeyboard(true)
    keyboardRef.current.setInput(value)
  }

  const display = {
    '{bksp}': 'Retroceso',
    '{enter}': 'Enter',
    '{space}': 'Espacio',
    '{tab}': 'Tab',
    '{lock}': 'Lock',
    '{shift}': 'Shift'
  }

  return (
    <>
      <div className="flex flex-col mt-[46px]">
        <label className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap mb-[13px]">
          {label}
        </label>
        <div className="flex gap-4 items-center">
          <input
            className={clsx(
              `h-[64px] w-${width} rounded-[5px] text-2xl bg-white dark:bg-dark border border-solid border-dark dark:border-light pl-[18px] text-dark dark:text-light p-4`,
              {
                'border-error': required && inputRef && inputRef.current && !inputRef.current.value,
                'focus:border-error':
                  required && inputRef && inputRef.current && !inputRef.current.value,
                'focus-visible:border-error':
                  required && inputRef && inputRef.current && !inputRef.current.value
              }
            )}
            type="text"
            onClick={onFocusInput}
            defaultValue={value}
            ref={inputRef}
          />
          <small className="font-roboto text-dark dark:text-light text-[20px]">{unidad}</small>
        </div>
      </div>
      <div
        ref={divRef}
        className={clsx('fixed inset-x-0 bottom-0 z-50', {
          hidden: !showKeyboard
        })}
      >
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          display={display}
          onChange={setValue}
          onKeyPress={onKeyPress}
          onKeyReleased={() => onChange(value)}
          theme="hg-theme-default"
        />
      </div>
    </>
  )
}
