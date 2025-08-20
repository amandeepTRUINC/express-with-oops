import { Router } from 'express'
import { authGuard } from '../guards/auth.guard'
import { handleCreateBuildingReq, handleDeleteBuildingReq, handleGetBuildingDetailsReq, handleGetBuildingListReq, handleUpdateBuildingDetailsReq } from '../controller/building.controller'
import { validateBuildingIdReq, validateCreateBuildingReq, validateUpdateBuildingReq } from '../validations'
import { roleGuard } from '../guards/role.guard'
import { roles_enum } from '../interfaces/roles.interface'

const router = Router()

router.get(
  '/list',
  authGuard,
  handleGetBuildingListReq
)

router.get(
  '/:id',
  authGuard,
  validateBuildingIdReq,
  handleGetBuildingDetailsReq
)

router.post(
  '/',
  authGuard,
  roleGuard([roles_enum.ADMIN]),
  validateCreateBuildingReq,
  handleCreateBuildingReq
)

router.put(
  '/',
  authGuard,
  roleGuard([roles_enum.ADMIN]),
  validateUpdateBuildingReq,
  handleUpdateBuildingDetailsReq
)

router.delete(
  '/:id',
  authGuard,
  roleGuard([roles_enum.ADMIN]),
  validateBuildingIdReq,
  handleDeleteBuildingReq
)

export default router