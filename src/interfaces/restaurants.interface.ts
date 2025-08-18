
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
  is_active: boolean
  approval_status: enum_restaurant_approval_status
  commission_rate: number
  owner_info?: {
    full_name: string
    email: string
    phone_number: string
  }
}