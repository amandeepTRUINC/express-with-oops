import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/common.interface";
import { handleErrorResponse, handleSuccessResponse } from "../utils/helperFunctions";
import { menuCategoryService } from "../services/menuCategory.service";
import { HTTP_STATUS_CODES } from "../constants/common";

export const handleCreateCategoryReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const categoryId = await menuCategoryService.createCategory(req.body)
    return handleSuccessResponse({ res, data:[categoryId], status: HTTP_STATUS_CODES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetCategoryListReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const categoryList = await menuCategoryService.getCategoryList()
    return handleSuccessResponse({res, data: [categoryList] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetCategoryDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const categoryId = parseInt(req.params.id)
    const categoryDetails = await menuCategoryService.getCategoryDetails(categoryId)
    return handleSuccessResponse({ res, data: [categoryDetails] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleUpdateCategoryDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const categoryId = parseInt(req.body.id)
    const updatedCategoryId = await menuCategoryService.updateCategoryDetails(categoryId, req.body)
    return handleSuccessResponse({ res, data:[updatedCategoryId] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleDeleteCategoryReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const categoryId = parseInt(req.params.id)
    await menuCategoryService.deleteCategory(categoryId)
    return handleSuccessResponse({ res })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}
