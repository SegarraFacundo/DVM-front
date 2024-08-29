import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Keyboard from 'react-simple-keyboard'

interface Props {
  label: string
  required?: boolean
  onChange: (value: string) => void
  unidad: string
  valueInitial: number
  width?: string
}

export function InputNumber({
  label,
  required,
  valueInitial,
  onChange,
  width = '[150px]',
  unidad
}: Props): JSX.Element {
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>(valueInitial.toString() ?? '')
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

  useEffect(() => {
    if (inputRef.current && inputRef.current.value) {
      inputRef.current.value = value
    }
  }, [value])

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

  const layout = {
    default: ['1 2 3', '4 5 6', '7 8 9', '{bksp} . 0 {enter}']
  }

  return (
    <>
      <div className="flex flex-col">
        <label className="font-roboto text-dark dark:text-light text-[20px] mb-2">{label}</label>
        <div className="flex gap-4 items-center">
          <input
            onClick={onFocusInput}
            ref={inputRef}
            value={value}
            className={clsx(
              `h-[60px] w-${width} text-2xl rounded-[5px] bg-white dark:bg-dark border border-solid border-dark dark:border-light pl-[18px] text-dark dark:text-light p-4`,
              {
                'border-error': required && inputRef && inputRef.current && !inputRef.current.value,
                'focus:border-error':
                  required && inputRef && inputRef.current && !inputRef.current.value,
                'focus-visible:border-error':
                  required && inputRef && inputRef.current && !inputRef.current.value
              }
            )}
            type="text"
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
          theme="hg-theme-default hg-theme-numeric hg-layout-numeric numeric-theme"
          layout={layout}
          mergeDisplay
          display={display}
          onChange={setValue}
          onKeyPress={onKeyPress}
          onKeyReleased={() => onChange(value)}
        />
      </div>
    </>
  )
}
