
export enum enum_restaurant_approval_status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface IRestaurant {
  id: number
  name: string
  address: string
  contact_number: string
  owner_id: number
  is_active: boolean
  approval_status: enum_restaurant_approval_status
  commission_rate: number
}