export interface IOrder {
  id?: number
  user_id: number
  restaurant_id: number
  order_status: number
  order_number: string
  order_type: order_type_enum
  rejected_reason?: string
  subtotal_amount: number
  commission_amount: number
  loyalty_discount: number
  total_amount: number
  restaurant_amount: number
  delivery_address: string
  estimated_time: Date
  special_instructions?: string
  can_cancel?: boolean
  items: IOrderItems[]
}

export enum order_type_enum {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY'
}


export interface IOrderItems {
  id?: number
  order_id: number
  menu_item_id: number
  quantity: number
  unit_price: number
  total_price: number
  customizations?: string
}

export enum order_status_enum {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}