import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/common.interface";
import { handleErrorResponse, handleSuccessResponse } from "../utils/helperFunctions";
import { floorService } from "../services/floor.service";
import { HTTP_STATUS_CODES } from "../constants/common";
import { CustomError } from "../utils/error";

export const handleCreateFloorReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const createdFloorId = floorService.createFloor(req.body)
    return handleSuccessResponse({ res, data: [{ id: createdFloorId }], status: HTTP_STATUS_CODES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetFloorListReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const buildingId = parseInt(req.query.building_id as string)
    if (!buildingId) {
      throw new CustomError({
        message: 'Invalid Building Id',
        status: HTTP_STATUS_CODES.BAD_REQUEST
      })
    }
    const floorList = floorService.getFloorList({
      where: {
        building_id: buildingId
      }
    })
    return handleSuccessResponse({ res, data: [floorList] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetFloorDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const floorId = parseInt(req.params.id)
    const floorDetails = await floorService.getFloorDetails(floorId)
    if (!floorDetails) {
      throw new CustomError({
        message: "Floor Not Found",
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    return handleSuccessResponse({ res, data: [floorDetails] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}
export const handleUpdateFloorReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const floorId = req.body.id
    const updatedId = await floorService.updateFloor(floorId, req.body)
    return handleSuccessResponse({ res, data: { id: updatedId } })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleDeleteFloorReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const floorId = parseInt(req.params.id)
    await floorService.deleteFloor(floorId)
    return handleSuccessResponse({ res })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}