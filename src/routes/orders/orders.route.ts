import { Router } from "express";
import { authGuard } from "../../guards/auth.guard";
import { handleGetAllOrdersReq, handleCreateOrderReq, handleDeleteOrderReq, handleGetOrderDetailsReq, handleUpdateOrderStatusReq } from "../../controllers/orders/orders.controller";
import { validateCreateOrderInReq, validateOrderIdInReq, validateOrderStatusInReq } from "../../validations";

const router = Router()

router.get(
  '/',
  authGuard,
  handleGetAllOrdersReq
)

router.get(
  '/:id',
  validateOrderIdInReq,
  authGuard,
  handleGetOrderDetailsReq
)

router.post(
  '/',
  validateCreateOrderInReq,
  authGuard,
  handleCreateOrderReq
)

router.patch(
  '/:id/status',
  [validateOrderIdInReq, validateOrderStatusInReq],
  authGuard,
  handleUpdateOrderStatusReq
)




export default router