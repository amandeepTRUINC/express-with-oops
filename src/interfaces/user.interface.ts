export interface IRoles {
  id: number
  name: string
}

export interface IUser {
  id: number
  full_name: string
  email: string
  phone_number: string
  password: string
  role_id: number
  roles?: IRoles
  status: boolean
}

export interface LoginRequst {
  identifier: string,
  password: string
}