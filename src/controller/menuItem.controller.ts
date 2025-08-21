import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/common.interface";
import { handleErrorResponse, handleSuccessResponse } from "../utils/helperFunctions";
import { menuItemService } from "../services/menuItem.service";
import { HTTP_STATUS_CODES } from "../constants/common";
import { CustomError } from "../utils/error";
import { IMenuItemFilter } from "../interfaces/menuItem.interface";

export const handleCreateItemReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const menuItemId = menuItemService.createMenuItem(req.body)
    return handleSuccessResponse({ res, data: [{ id: menuItemId }], status: HTTP_STATUS_CODES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetItemListReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const filter = req.query.filter as unknown as IMenuItemFilter
    if (!filter) {
      throw new CustomError({
        message: "Invalid Filter",
        status: HTTP_STATUS_CODES.FORM_ERROR
      })
    }
    const itemList = await menuItemService.getMenuItemList({
      where: {
        category_id: filter.category_id
      }
    })
    return handleSuccessResponse({ res, data: [itemList] })

  } catch (error) {
    return handleErrorResponse(res, error)
  }

}

export const handleGetItemDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const itemId = parseInt(req.params.id)
    const itemDetails = await menuItemService.getMenuItemDetails(itemId)
    if (!itemDetails) {
      throw new CustomError({
        message: 'Menu Item Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    return handleSuccessResponse({ res, data: [itemDetails] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleUpdateItemReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const itemId = parseInt(req.params.id)
    const updatedItemId = await menuItemService.updateMenuItemDetails(itemId, req.body)
    return handleSuccessResponse({ res, data: [{ id: updatedItemId }] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleDeleteItemReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const itemId = parseInt(req.params.id)
    await menuItemService.deleteMenuItem(itemId)
    return handleSuccessResponse({ res })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}