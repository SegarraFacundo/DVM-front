import React from 'react'
import './keyboard.css'
import Keyboard from 'react-simple-keyboard'
import { useKeyBoard } from './hooks/UseKeyBoard'

export function KeyBoard () {
  const { toggleKeyBoard, setValue, value, openedKeyBoard } = useKeyBoard()

  const onChange = (input: string) => {
    setValue(`${value ?? ''}${input}`)
  }

  const display = {
    '{bksp}': 'Retroceso',
    '{enter}': 'Enter',
    '{space}': 'Espacio',
    '{tab}': 'Tab',
    '{lock}': 'Lock',
    '{shift}': 'Shift'
  }

  const onKeyPress = (button: string) => {
    if (button === '{enter}') toggleKeyBoard()
  }

  const handleOnClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      event.preventDefault()
      event.stopPropagation()
      toggleKeyBoard()
    }
  }

  return openedKeyBoard
    ? (
      <div className='absolute inset-x-0 bottom-0  z-50' onClick={handleOnClickOutside}>
        <Keyboard onChange={onChange} onKeyPress={onKeyPress} display={display} />
      </div>
      )
    : (
      <></>
      )
}
