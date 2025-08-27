import { Response, Request } from "express"
import { IUser } from "../users/user.interface"

export interface ICustomError {
  message?: string
  status?: number
  data?: unknown
  extraMessage?: unknown
}

export interface GlobalResponse extends ICustomError {
  res: Response
  data?: unknown
  error?: unknown
}

export interface AuthenticatedRequest extends Request {
  user?: IUser
}
