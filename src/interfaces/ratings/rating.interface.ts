export interface IRating {
  id?: number
  user_id: number
  restaurant_id: number
  rating: number
  comment: string
  order_id?: number 
}

