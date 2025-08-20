import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/common.interface";
import { handleError, handleErrorResponse, handleSuccessResponse } from "../utils/helperFunctions";
import { buildingService } from "../services/building.service";
import { HTTP_STATUS_CODES } from "../constants/common";
import { CustomError } from "../utils/error";

export const handleCreateBuildingReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const buildingId = await buildingService.createBuilding(req.body)
    return handleSuccessResponse({ res, data: [buildingId], status: HTTP_STATUS_CODES.CREATED})
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetBuildingListReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const buildingList = await buildingService.getBuildingList()
    return handleSuccessResponse({ res, data: [buildingList]})
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetBuildingDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const buildingId = parseInt(req.params.id as string)
    const buildingDetails = await buildingService.getBuildingDetails({ id: buildingId})
    if (!buildingDetails) {
      throw new CustomError({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: 'Building Not found'
      })
    }
    return handleSuccessResponse({ res, data: [buildingDetails]})
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleUpdateBuildingDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const buildingId = parseInt(req.body.id as string)
    const updatedDetails = await buildingService.updateBuilding(buildingId, req.body)
    return handleSuccessResponse({ res, data: [updatedDetails]})
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleDeleteBuildingReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const buildingId = parseInt(req.params.id as string)

    await buildingService.deleteBuilding(buildingId)
    return handleSuccessResponse({ res })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}