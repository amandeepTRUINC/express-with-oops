import { Router } from 'express'
import { authGuard } from '../guards/auth.guard'
import { roleGuard } from '../guards/role.guard'
import { validateCategoryIdInReq, validateCreateCategoryReq, validateUpdateCategoryReq } from '../validations'
import { roles_enum } from '../interfaces/roles.interface'
import { handleCreateCategoryReq, handleDeleteCategoryReq, handleGetCategoryDetailsReq, handleUpdateCategoryDetailsReq } from '../controller/menu.category.controller'

const router = Router()

router.post(
  '/',
  validateCreateCategoryReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleCreateCategoryReq
)

router.get(
  '/',
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER, roles_enum.CUSTOMER]),
  handleGetCategoryDetailsReq
)

router.get(
  '/:id',
  validateCategoryIdInReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER, roles_enum.CUSTOMER]),
  handleGetCategoryDetailsReq
)

router.put(
  '/',
  validateUpdateCategoryReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleUpdateCategoryDetailsReq
)

router.delete(
  '/:id',
  validateCategoryIdInReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleDeleteCategoryReq
)

export default router