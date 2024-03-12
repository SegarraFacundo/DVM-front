import React, { useEffect, useRef, useState } from 'react'
import { FieldErrors, RegisterOptions, UseFormRegister } from 'react-hook-form'
import clsx from 'clsx'
import './keyboard.css'
import Keyboard from 'react-simple-keyboard'

interface Props {
  label: string
  name: string
  options: RegisterOptions<Record<string, string>>
  register: UseFormRegister<Record<string, string>>
  errors?: FieldErrors
  initialValue?: string
}

export function InputText({ label, name, register, options, errors }: Props): JSX.Element {
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)
  const [state, setState] = useState<{
    layoutName?: string
    input?: string
  }>({
    layoutName: 'default',
    input: ''
  })

  const divRef = useRef<HTMLDivElement>(null)

  const [theme, setTheme] = useState<string>('hg-theme-default')

  const setThemeKeyboard = async (): Promise<void> => {
    const result = await window.api.invoke.getOperariosAsync()
    setTheme(result ? 'hg-theme-dark' : 'hg-theme-default')
  }

  useEffect(() => {
    setThemeKeyboard()

    const handleClickOutside = (event): void => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowKeyboard(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  let keyboardRef = useRef()

  const onChange = (input: string): void => {
    setState({ input })
    console.log('Input changed', input)
  }

  const onKeyPress = (button: string): void => {
    console.log('Button pressed', button)

    if (button === '{enter}') setShowKeyboard(false)

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === '{shift}' || button === '{lock}') handleShift()
  }

  const handleShift = (): void => {
    const layoutName = state.layoutName

    setState({
      layoutName: layoutName === 'default' ? 'shift' : 'default',
      input: state.input
    })
  }

  const onFocusInput = (): void => {
    setShowKeyboard(true)
  }

  const display = {
    '{bksp}': 'Retroceso',
    '{enter}': 'Enter',
    '{space}': 'Espacio',
    '{tab}': 'Tab',
    '{lock}': 'Lock',
    '{shift}': 'Shift'
  }

  const onChangeInput = (event): void => {
    const input = event.target.value
    setState({ input })
    keyboardRef.setInput(input)
  }

  return (
    <>
      <div className="flex flex-col mt-[46px]">
        <label className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap mb-[13px]">
          {label}
        </label>
        <input
          className={clsx(
            'h-[64px] w-[366px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
            {
              'border-error': errors && errors[name],
              'focus:border-error': errors && errors[name],
              'focus-visible:border-error': errors && errors[name]
            }
          )}
          type="text"
          value={state.input}
          {...register(name, options)}
          onChange={onChangeInput}
          onFocus={onFocusInput}
        />
      </div>
      {showKeyboard && (
        <div ref={divRef} className="fixed inset-x-0 bottom-0 z-50">
          <Keyboard
            keyboardRef={(r) => (keyboardRef = r)}
            layoutName={state.layoutName}
            display={display}
            onChange={onChange}
            onKeyPress={onKeyPress}
            theme={theme}
          />
        </div>
      )}
    </>
  )
}
