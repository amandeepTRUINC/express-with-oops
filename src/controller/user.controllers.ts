import { Request, Response } from "express";
import { AuthenticatedRequest, GlobalResponse } from "../interfaces/common.interface";
import { handleErrorResponse, handleSuccessResponse } from "../utils/helperFunctions";
import { userService } from "../services/user.service";
import { CustomError } from "../utils/error";
import { HTTP_STATUS_CODES } from "../constants/common";

export async function handleCreateUser (req: Request, res: Response): Promise<Response> {
  try {
    const createdUserId = await userService.createUser(req.body).catch((error) => {
      throw error;
    });
    return handleSuccessResponse({ res, data: [{ id: createdUserId }], status: HTTP_STATUS_CODES.CREATED } as GlobalResponse);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

export async function handleDeleteUser (req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const userId = req.user?.id;
    await userService.deleteUser({ id: userId });
    return handleSuccessResponse({ res, data: [], status: HTTP_STATUS_CODES.SUCCESS } as GlobalResponse);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

// TODO - Need to add a check where admin can view all the users but 'RESTRAUNT_OWNER' can only view its corresponding users
export async function handleGetAllUsers (req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const userDetails = await userService.getAllUser().catch((error) => {
      throw error;
    });
    return handleSuccessResponse({ res, message: 'SUCCESS', data: [userDetails] });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

export async function handleGetUserDetails (req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const userId = req.user?.id;
    const userDetails = await userService.getUserDetails({ id: userId }).catch((error) => {
      throw error;
    });
    if (!userDetails) {
      throw new CustomError({
        message: "No User Found",
        status: HTTP_STATUS_CODES.NOT_FOUND
      });
    }
    return handleSuccessResponse({ res, message: 'SUCCESS', data: [userDetails] });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

export async function handleUpdateUser (req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const requestBody = req.body;
    const userId = req.user?.id;
    const updatedUserDeails = await userService.updateUser({ id: userId }, requestBody).catch((error) => {
      throw error;
    });
    return handleSuccessResponse({ res, message: 'SUCCESS', data: [updatedUserDeails] });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}
