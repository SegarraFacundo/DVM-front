import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import './keyboard.css'
import Keyboard from 'react-simple-keyboard'

interface Props {
  label: string
  required?: boolean
  onChange: (value: React.ChangeEvent) => void
  unidad: string
  valueInitial: number
}

export function InputNumber({ label, required, valueInitial, onChange, unidad }: Props): JSX.Element {
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>(valueInitial.toString()?? '')
  const divRef = useRef<HTMLDivElement>(null)

  const [theme, setTheme] = useState<string>('hg-theme-default')

  const keyboardRef = useRef<any>(null)

  const setThemeKeyboard = async (): Promise<void> => {
    const result = await window.api.invoke.isThemeModeDark()
    setTheme(
      result
        ? 'hg-theme-dark hg-theme-numeric-dark hg-layout-numeric-dark numeric-theme-dark'
        : 'hg-theme-default hg-theme-numeric hg-layout-numeric numeric-theme'
    )
  }

  useEffect(() => {
    setThemeKeyboard()

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

  const layout = {
    default: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 {enter}']
  }

  return (
    <>
      <div className="flex flex-col">
        <label className="font-roboto text-dark dark:text-light text-[20px]">{label}</label>
        <div className="flex gap-4 items-center">
          <input
            onClick={onFocusInput}
            ref={inputRef}
            value={value}
            onChange={onChange}
            className={clsx(
              'h-[60px] w-[150px] rounded-[5px] bg-white dark:bg-dark border border-solid border-dark dark:border-light pl-[18px] text-dark dark:text-light p-4',
              {
                'border-error': required && inputRef && inputRef.current && !inputRef.current.value,
                'focus:border-error':
                  required && inputRef && inputRef.current && !inputRef.current.value,
                'focus-visible:border-error':
                  required && inputRef && inputRef.current && !inputRef.current.value
              }
            )}
            type="number"
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
          theme={theme}
          layout={layout}
          mergeDisplay
          display={display}
          onChange={setValue}
          onKeyPress={onKeyPress}
          onKeyReleased={() => {
            if (inputRef && inputRef.current) inputRef.current.value = value
          }}
        />
      </div>
    </>
  )
}
