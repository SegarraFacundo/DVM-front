import { ItemMenu } from './interfaces/item-menu.interface'
import { Link } from 'react-router-dom'
import { useToggle } from '../hooks/useToggle'

interface PropsItemMenu {
  itemMenu: ItemMenu
}

export function ItemMenuAside({ itemMenu }: PropsItemMenu) {
  const { toggleOpenedState } = useToggle()

  const handleLinkClick = () => {
    toggleOpenedState('menu-lateral')
  }

  return (
    <Link
      onClick={handleLinkClick}
      to={itemMenu.link}
      className="flex h-[48px] mb-[24px] cursor-pointer"
    >
      <div className="pl-[18px]">
        <img src={`data:image/svg+xml;utf8,${encodeURIComponent(itemMenu.icon)}`} />
      </div>
      <p className="text-dark text-center font-roboto text-[16px] not-italic leading-[normal] pl-[18px]">
        {itemMenu.title}
      </p>
    </Link>
  )
}
