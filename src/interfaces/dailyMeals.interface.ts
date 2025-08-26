import { IMenuItem } from "./menuItem.interface"

export interface IDailyMeals {
  id?: number
  restaurant_id:number
  menu_item_id?: number
  available_on?: Date
  is_featured?: boolean
  meal_type: MealType
  menu_items?:IMenuItem[]
  description: string
}

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";