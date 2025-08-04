import { ICustomError } from "./common.interface"

export interface IRoles {
  id: number
  name: string
  created_at?: unknown
}
export interface IRolesRepository {
  getDefaultRole: () => Promise<IRoles | ICustomError>
}


export interface IRolesService {
  getDefaultRole: () => Promise<IRoles>
}