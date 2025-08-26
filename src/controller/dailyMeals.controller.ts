import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/common.interface";
import { handleError, handleErrorResponse, handleSuccessResponse } from "../utils/helperFunctions";
import { dailyMealsService } from "../services/dailyMeals.service";
import { CustomError } from "../utils/error";
import { HTTP_STATUS_CODES } from "../constants/common";

export const handleGetDailyMealsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const restaurantId = parseInt(req.query.restaurant_id as string) as number
    const dailyMealsList = await dailyMealsService.getDailyMeals({
      where: {
        restaurant_id: restaurantId
      }
    })
    return handleSuccessResponse({ res, data: [dailyMealsList] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetDailyMealDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const mealId = parseInt(req.params.id as string) as number
    const mealDetails = await dailyMealsService.getMealDetails({
      where: {
        id: mealId
      }
    })
    if (!mealDetails) {
      throw new CustomError({
        message: "Meal Not Found",
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    return handleSuccessResponse({ res, data: [mealDetails] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleCreateDailyMealReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const mealId = await dailyMealsService.createDailyMeal(req.body)
    return handleSuccessResponse({ res, data: [{ id: mealId }], status: HTTP_STATUS_CODES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleUpdateDailyMealReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const mealId = req.body.id
    const updatedId = await dailyMealsService.updateDailyMeal(mealId, req.body)
    return handleSuccessResponse({ res, data: [{ id: updatedId }] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleDeleteDailyMealReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const mealId = parseInt(req.params.id as string)
    await dailyMealsService.deleteDailyMeal(mealId)
    return handleSuccessResponse({ res })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}