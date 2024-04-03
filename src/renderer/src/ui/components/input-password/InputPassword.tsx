import { useState } from 'react'
import showPassword from './icons/eye.svg'
import hidePasword from './icons/hidden.svg'
import './input-password.css'
import clsx from 'clsx'

interface Props {
  label: string
  error: boolean
  setPassword
}
export function InputPassword({label, error, setPassword}: Props): JSX.Element {

  const [passwordType, setPasswordType] = useState(true)

  return (
    <>
    <div className="flex flex-col mt-[46px] relative">
      <label className="font-roboto font-bold text-success text-[20px] tracking-[0] leading-[normal] whitespace-nowrap mb-[13px]">
        {label}
      </label>
      <input
        className={clsx(
          'h-[64px] w-[366px] rounded-[5px] bg-[#172530] border border-solid border-[#fff] pl-[18px] text-white p-4',
          {
            'border-error': error,
            'focus:border-error': error,
            'focus-visible:border-error': error
          }
        )}
        type={passwordType ? 'password' : 'text'}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div onClick={() => setPasswordType((prev) => !prev)}>
        {passwordType ? (
          <img className='absolute cursor-pointer top-[60%] right-[5px] -translate-x-2/4' src={showPassword} alt="Hide" />
        ) : (
          <img className='absolute cursor-pointer top-[55%] right-[5px] -translate-x-2/4' src={hidePasword} alt="Show" />
        )}
      </div>
    </div>
  </>
    // <div className="form__controls">
    //   <input
    //     id="password"
    //     type={passwordType ? 'password' : 'text'}
    //     required
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //   />

    //   <div onClick={() => setPasswordType((prev) => !prev)}>
    //     {passwordType ? (
    //       <img src={hidePasword} alt="Hide" />
    //     ) : (
    //       <img src={showPassword} alt="Show" />
    //     )}
    //   </div>
    // </div>
  )
}
