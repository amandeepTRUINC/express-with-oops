import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/shared/common.interface";
import { handleErrorResponse, handleSuccessResponse } from "../../utils/helperFunctions";
import { orderService } from "../../services/orders/order.service";
import { CustomError } from "../../utils/error";
import { HTTP_STATUS_CODES } from "../../constants/common";
import { order_status_enum } from "../../interfaces/orders/order.interface";

export const handleGetAllOrdersReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id
    const userOrders = await orderService.getOrderList({
      where: {
        user_id: userId
      }
    })
    return handleSuccessResponse({
      res,
      data: [userOrders]
    })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleGetOrderDetailsReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id
    const orderId = parseInt(req.params.id)
    const orderDetails = await orderService.getOrderDetails(orderId, userId as number)
    if (!orderDetails) {
      throw new CustomError({
        message: 'Order Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    return handleSuccessResponse({
      res,
      data: [orderDetails]
    })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleCreateOrderReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { id, order_number } = await orderService.createOrder(req.body) as { id: number, order_number: string }
    return handleSuccessResponse({
      res,
      data: [{
        id,
        order_number
      }]
    })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}
export const handleUpdateOrderStatusReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const orderId = parseInt(req.params.id)
    const orderStatus = req.params.status
    const updatedOrderId = await orderService.updateOrderStatus(orderId, orderStatus as order_status_enum)
    return handleSuccessResponse({
      res,
      data: [{
        id: updatedOrderId
      }]
    })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const handleDeleteOrderReq = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const orderId = parseInt(req.params.id)
    await orderService.deleteOrder(orderId)
    return handleSuccessResponse({
      res
    })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}