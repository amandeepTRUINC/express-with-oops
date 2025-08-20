import { IMenuItem } from "./menuItem.interface"

export interface IMenuCategory{
  id?: number
  name: string
  restaurant_id: number
  is_available: boolean
  display_order: number
  menu_items?: IMenuItem[]
}


