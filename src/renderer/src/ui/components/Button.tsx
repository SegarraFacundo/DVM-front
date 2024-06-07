import React, { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  type?:
    | 'success'
    | 'success-dark'
    | 'warning'
    | 'error'
    | 'default'
    | 'default-light'
    | 'success-light'
    | 'warning-light'
    | 'error-light'
  disabled?: boolean
  children: ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  maxWith?: boolean
  className?: string
}

export function Button({
  size = 'md',
  type = 'default',
  disabled = false,
  children,
  onClick,
  maxWith = true,
  className = ''
}: Props): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(`text-[17px] font-roboto rounded-md whitespace-nowrap ${className}`, {
        'w-full': maxWith,
        'px-[15px] py-[7px]': size === 'sm',
        'px-[25px] py-[14px]': size === 'md',
        'px-[60px] py-[20px]': size === 'lg',
        'border-[#A0A0A0] border-[1px] text-dark dark:text-light': type === 'default-light',
        'border-success border-[1px] text-success': type === 'success-light',
        'border-warning border-[1px] text-warning': type === 'warning-light',
        'border-error border-[1px] text-error': type === 'error-light',
        'bg-transparent': type.endsWith('-light'),
        'bg-default ': type === 'default',
        'bg-success text-dark dark:text-light': type === 'success',
        'bg-warning text-dark dark:text-light': type === 'warning',
        'bg-light dark:bg-dark text-success': type === 'success-dark',
        'bg-error text-dark dark:text-light': type === 'error',
        'bg-default/50': type === 'default' && disabled,
        'bg-success/50': type === 'success' && disabled,
        'bg-warning/50': type === 'warning' && disabled,
        'bg-error/50': type === 'error' && disabled
      })}
    >
      {children}
    </button>
  )
}
