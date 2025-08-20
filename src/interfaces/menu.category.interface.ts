import { IMenuItem } from "./menu.item.interface"

export interface IMenuCategories{
  name: string
  restaurant_id: number
  is_available: boolean
  display_order: number
  menu_items?: IMenuItem[]
}


