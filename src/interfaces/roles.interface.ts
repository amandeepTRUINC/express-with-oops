export interface IRoles {
  id: number
  name: string
  created_at?: unknown
}

export enum roles_enum {
  CUSTOMER = 'customer',
  RESTRAUNT_OWNER = 'restraunt_owner',
  ADMIN = 'admin'
}