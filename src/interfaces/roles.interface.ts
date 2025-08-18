export interface IRoles {
  id: number
  name: string
  created_at?: unknown
}

export enum roles_enum {
  CUSTOMER = 'customer',
  RESTAURANT_OWNER = 'restaurant_owner',
  ADMIN = 'admin'
}