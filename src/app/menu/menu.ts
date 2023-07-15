import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Home',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'home'
  },
  {
    id: 'customer',
    title: 'Customer',
    translate: 'MENU.CUSTOMER',
    type: 'item',
    icon: 'users',
    url: 'customer'
  },
  {
    id: 'order',
    title: 'Order',
    translate: 'MENU.ORDER',
    type: 'item',
    icon: 'briefcase',
    url: 'order'
  },
  {
    id: 'config',
    title: 'Config',
    translate: 'MENU.CONFIG',
    type: 'item',
    icon: 'settings',
    url: 'config'
  },
]
