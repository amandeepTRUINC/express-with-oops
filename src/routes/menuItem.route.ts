import { Router } from 'express'
import { authGuard } from '../guards/auth.guard'
import { handleCreateItemReq, handleDeleteItemReq, handleGetItemDetailsReq, handleGetItemListReq, handleUpdateItemReq } from '../controller/menuItem.controller'
import { validateCreateMenuItemInReq, validateMenuItemIdInReq, validateUpdateMenuitemInReq } from '../validations'
import { roleGuard } from '../guards/role.guard'
import { roles_enum } from '../interfaces/roles.interface'

const router = Router()

router.get(
  '/',
  authGuard,
  handleGetItemListReq
)

router.get(
  '/:id',
  validateMenuItemIdInReq,
  authGuard,
  handleGetItemDetailsReq
)

router.post(
  '/',
  validateCreateMenuItemInReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleCreateItemReq
)

router.put(
  '/',
  validateUpdateMenuitemInReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleUpdateItemReq
)

router.delete(
  '/:id',
  validateMenuItemIdInReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleDeleteItemReq
)



export default router