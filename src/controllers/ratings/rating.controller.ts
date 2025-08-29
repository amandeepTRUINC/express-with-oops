import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/shared/common.interface";
import { handleErrorResponse, handleSuccessResponse } from "../../utils/helperFunctions";
import { ratingService } from "../../services/ratings/ratings.service";
import { HTTP_STATUS_CODES } from "../../constants/common";

export const handleGetRatingsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const restaurantId = parseInt(req.query.restaurant_id as string)
    const ratingList = await ratingService.getRatingList({
      where: {
        restaurant_id: restaurantId
      }
    })
    return handleSuccessResponse({ res, data: [ratingList] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleCreateRatingReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id
    const ratingId = await ratingService.createRating({ ...req.body, user_id: userId })
    return handleSuccessResponse({ res, data: [{ id: ratingId }], status: HTTP_STATUS_CODES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}


export const handleUpdateRatingReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const ratingId = req.body.id
    await ratingService.updateRating(ratingId, req.body)
    return handleSuccessResponse({ res, data: [{ id: ratingId}]})
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleDeleteRatingReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const ratingId = parseInt(req.params.id)
    await ratingService.deleteRating(ratingId, req.user?.id as number)
    return handleSuccessResponse({ res })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}