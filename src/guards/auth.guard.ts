import { NextFunction, Request, Response } from "express";
import { handleErrorResponse } from "../utils/helperFunctions";
import { CustomError } from "../utils/error";
import jwt from 'jsonwebtoken'
import { userService } from "../services/user.service";
import { AuthenticatedRequest } from "../interfaces/common.interface";
import { IUser } from "../interfaces/user.interface";
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "../constants/common";
export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
      throw new CustomError({
        message: HTTP_STATUS_MESSAGES.UN_AUTHORIZED,
        status: HTTP_STATUS_CODES.UN_AUTHORIZED
      })
    }
    const authToken = authHeaders.split(" ")[1];
    const payload = jwt.verify(authToken, process.env.JWT_SECRET as string)
    if (!payload || typeof payload !== 'object' || !('id' in payload)) {
      throw new CustomError({
        message: HTTP_STATUS_MESSAGES.UN_AUTHORIZED,
        status: HTTP_STATUS_CODES.UN_AUTHORIZED
      })
    }
    const userDetails = await userService.getUserDetails({
      id: parseInt((payload as jwt.JwtPayload)['id'] as string)
    });

    (req as AuthenticatedRequest).user = userDetails as IUser
    next()
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}