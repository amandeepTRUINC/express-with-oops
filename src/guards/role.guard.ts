import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../interfaces/common.interface"
import { CustomError } from "../utils/error"
import { handleErrorResponse } from "../utils/helperFunctions"
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "../constants/common"

export const roleGuard = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (allowedRoles.includes(req.user?.roles?.name as string)) {
        next()
      } else {
        throw new CustomError({
          message: HTTP_STATUS_MESSAGES.FORBIDDEN_RESOURCE,
          status: HTTP_STATUS_CODES.FORBIDDEN
        })
      }
    } catch (error) {
      return handleErrorResponse(res, error)
    }
  }
}