import React, { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  type?: 'success' | 'success-dark' | 'warning' | 'error' | 'default' | 'default-light'
  disabled?: boolean
  children: ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function Button ({ size = 'md', type = 'default', disabled = false, children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'text-[17px] font-roboto text-[#1C2E3D] rounded-md w-full',
        {
          'px-[15px] py-[7px]': size === 'sm',
          'px-[25px] py-[14px]': size === 'md',
          'px-[60px] py-[20px]': size === 'lg',
          'border-[#A0A0A0] border-[1px] text-[#FFF]': type === 'default-light',
          'bg-transparent': type === 'default-light',
          'bg-default': type === 'default',
          'bg-success': type === 'success',
          'bg-warning': type === 'warning',
          'bg-dark text-success': type === 'success-dark',
          'bg-error text-white': type === 'error',
          'bg-default/50': type === 'default' && disabled,
          'bg-success/50': type === 'success' && disabled,
          'bg-warning/50': type === 'warning' && disabled,
          'bg-error/50': type === 'error' && disabled
        }
      )}
    >
      {children}
    </button>
  )
}
