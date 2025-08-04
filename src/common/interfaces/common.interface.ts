import { Response, Request } from "express"
import { IUser } from "./user.interface"
import { CustomError } from "../../utils/error"

export interface ICustomError {
  message: string
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

export interface IHelperFunctions {
  handleError: (error: unknown) => ICustomError
  handleSuccessResponse: (props: GlobalResponse) => Response
  handleErrorResponse: (res: Response, errorDetails: CustomError | unknown) => Response
  hashPassword: (password: string) => Promise<string>
}