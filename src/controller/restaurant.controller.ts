import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/common.interface";
import { handleErrorResponse, handleSuccessResponse } from "../utils/helperFunctions";
import { createRestaurant, getRestaurantList } from "../services/restaurants.service";

export const handleCreateRestaurantReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const restaurantId = await createRestaurant(req.body).catch((error) => {
      throw error
    })
    return handleSuccessResponse({ res, data: [{ id: restaurantId }] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetRestaurantListReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const restaurantList = await getRestaurantList()
    return handleSuccessResponse({ res, data: [restaurantList]})
  } catch (error) {
  return handleErrorResponse(res, error) 
  }
}
