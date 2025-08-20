import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/common.interface";
import { handleError, handleErrorResponse, handleSuccessResponse } from "../utils/helperFunctions";
import { restaurantService } from "../services/restaurants.service";
import { CustomError } from "../utils/error";
import { HTTP_STATUS_CODES } from "../constants/common";

export const handleCreateRestaurantReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const restaurantId = await restaurantService.createRestaurant(req.body).catch((error) => {
      throw error
    })
    return handleSuccessResponse({ res, data: [{ id: restaurantId }], status: HTTP_STATUS_CODES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetRestaurantListReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const restaurantList = await restaurantService.getRestaurantList()
    return handleSuccessResponse({ res, data: [restaurantList] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetRestaurantDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const restaurantId = parseInt(req.params.id)
    const restaurantDetails = await restaurantService.getRestaurantDetails(restaurantId).catch((error) => {
      throw error
    })
    if (!restaurantDetails) {
      throw new CustomError({
        message: 'Restaurant not Found',
        status: 404
      })
    }
    return handleSuccessResponse({ res, data: [restaurantDetails] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}


export const handleUpdatedRestaurantReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const updatedDetails = await restaurantService.updateRestaurantDetails(req.body)
    return handleSuccessResponse({ res, data: [{ id: updatedDetails }]})
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleUpdatedRestaurantStatusReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const restaurantId = parseInt(req.params.id)
    const status = req.params.status
    await restaurantService.updaterestaurantStatus(restaurantId, status)
    return handleSuccessResponse({ res, data: [{ id: restaurantId }]})
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}