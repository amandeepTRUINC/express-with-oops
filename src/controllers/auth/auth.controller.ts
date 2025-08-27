import { Request, Response } from "express";
import { handleErrorResponse, handleSuccessResponse } from "../../utils/helperFunctions";
import { loginUser } from "../../services/auth/auth.service";


export const handleLoginReq = async (req: Request, res: Response) => {
  try {
    const loginResponse = await loginUser(req.body).catch((error) => {
      throw error
    })
    return handleSuccessResponse({
      res, data: [loginResponse]
    })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}