import { Router } from 'express'
import { authGuard } from '../../guards/auth.guard'
import { handlebuildingDeAllocationReq, handleBuilingAllocationReq, handleCreateBuildingReq, handleDeleteBuildingReq, handleGetBuildingDetailsReq, handleGetBuildingListReq, handleUpdateBuildingDetailsReq } from '../../controllers/building/building.controller'
import { validateAllocateBuildingReq, validateBuildingIdReq, validateCreateBuildingReq, validateDeAllocateBuildingReq, validateUpdateBuildingReq } from '../../validations/index'
import { roleGuard } from '../../guards/role.guard'
import { roles_enum } from '../../interfaces/roles/roles.interface'

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

router.post(
  '/allocate',
  authGuard,
  validateAllocateBuildingReq,
  handleBuilingAllocationReq
)

router.post(
  '/de-allocate',
  authGuard,
  validateDeAllocateBuildingReq,
  handlebuildingDeAllocationReq
)

export default router