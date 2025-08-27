import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/shared/common.interface";
import { handleErrorResponse, handleSuccessResponse } from "../../utils/helperFunctions";
import { cartItemService } from "../../services/cartItems/cartItems.service";
import { HTTP_STATUS_CODES } from "../../constants/common";

export const handleGetCartListReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id as number
    const cartItems = await cartItemService.getCartItemsList({ user_id: userId })
    return handleSuccessResponse({ res, data:[cartItems] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetCartDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> =>{
  try {
    const cartId = parseInt(req.params.id)
    const cartDetails = await cartItemService.getCartDetails(cartId)
    return handleSuccessResponse({ res, data: [cartDetails] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleCreateCartItemReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const createdId = await cartItemService.createCartItem(req.body)
    return handleSuccessResponse({ res, data:[{ id: createdId}], status: HTTP_STATUS_CODES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleUpdateCartReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const cartId = req.body.id
    const requestBody = req.body
    const updatedId = await cartItemService.updateCartDetails(cartId, requestBody)
    return handleSuccessResponse({ res, data:[{ id: updatedId}] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}