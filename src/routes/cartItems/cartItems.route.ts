import { Router } from 'express'
import { authGuard } from '../../guards/auth.guard'
import { handleCreateCartItemReq, handleGetCartDetailsReq, handleGetCartListReq, handleUpdateCartReq } from '../../controllers/cartItem/cartItem.controller'
import { validateCartItemIdInReq, validateCreateCartItemInReq, validateUpdateCartItemInReq } from '../../validations'

const router = Router()

router.get(
  '/',
  authGuard,
  handleGetCartListReq
)

router.get(
  '/:id',
  validateCartItemIdInReq,
  authGuard,
  handleGetCartDetailsReq
)

router.post(
  '/',
  validateCreateCartItemInReq,
  authGuard,
  handleCreateCartItemReq
)

router.put(
  '/',
  validateUpdateCartItemInReq,
  authGuard,
  handleUpdateCartReq
)



export default router