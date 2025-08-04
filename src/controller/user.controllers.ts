import { Request, Response } from "express";
import { IUserController, IUserService } from "../common/interfaces/user.interface";
import { AuthenticatedRequest, GlobalResponse, IHelperFunctions } from "../common/interfaces/common.interface";
import { helperFunctions } from "../utils/helperFunctions";
import { userService } from "../services/user.service";
import { CustomError } from "../utils/error";
import { BaseController } from "../base/base.controller";

class UserController extends BaseController implements IUserController {

  constructor(
    private userService: IUserService,
    private helperFunctions: IHelperFunctions
  ) {
    super()
  }

  async createUser (req: Request, res: Response): Promise<Response> {
    try {
      const createdUserId = await this.userService.createUser(req.body).catch((error) => {
        throw error
      })

      return this.helperFunctions.handleSuccessResponse({ res: res, data: [{ id: createdUserId }], status: 201 } as GlobalResponse)
    } catch (error) {
      return this.helperFunctions.handleErrorResponse(res, error)
    }
  }

  async deleteUser (req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.id)
      await this.userService.deleteUser({ id: userId })
      return this.helperFunctions.handleSuccessResponse({ res: res, data: [], status: 200 } as GlobalResponse)

    } catch (error) {
      return this.helperFunctions.handleErrorResponse(res, error)
    }

  }
  async getAllUser (req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userDetails = await this.userService.getAllUser().catch((error) => {
        throw error
      })
      return this.helperFunctions.handleSuccessResponse({ res, message: 'SUCCESS', data: [userDetails] })
    } catch (error) {
      return this.helperFunctions.handleErrorResponse(res, error)
    }
  }
  async getUserDetails (req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.id)
      const userDetails = await this.userService.getUserDetails({ id: userId }).catch((error) => {
        throw error
      })
      if (!userDetails) {
        throw new CustomError({
          message: "No User Found",
          status: 404
        })
      }
      return this.helperFunctions.handleSuccessResponse({ res, message: 'SUCCESS', data: [userDetails] })
    } catch (error) {
      return this.helperFunctions.handleErrorResponse(res, error)
    }
  }
  async updateUser (req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const requestBody = req.body
      const userId = parseInt(req.params.id)
      const updatedUserDeails = await this.userService.updateUser({ id: userId }, requestBody).catch((error) => {
        throw error
      })
      return this.helperFunctions.handleSuccessResponse({ res, message: 'SUCCESS', data: [updatedUserDeails] })

    } catch (error) {
      return this.helperFunctions.handleErrorResponse(res, error)
    }
  }
}

export default new UserController(userService, helperFunctions) 