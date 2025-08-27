import { Router } from 'express'
import { validateCreateRestaurantReq, validateUpdateRestaurantReq, validateUpdateRestaurantStatusReq } from '../../validations/index'
import { authGuard } from '../../guards/auth.guard'
import { roleGuard } from '../../guards/role.guard'
import { roles_enum } from '../../interfaces/roles/roles.interface'
import { handleCreateRestaurantReq, handleGetRestaurantDetailsReq, handleGetRestaurantListReq, handleUpdatedRestaurantReq, handleUpdatedRestaurantStatusReq } from '../../controllers/restaurants/restaurant.controller'

const router = Router()

router.post(
  '/',
  validateCreateRestaurantReq,
  // authGuard,
  // roleGuard([roles_enum.ADMIN]),
  handleCreateRestaurantReq
)

router.get(
  '/',
  authGuard,
  roleGuard([roles_enum.ADMIN]),
  handleGetRestaurantListReq
)

router.get(
  '/:id',
  authGuard,
  handleGetRestaurantDetailsReq
)

router.put(
  '/:id',
  validateUpdateRestaurantReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleUpdatedRestaurantReq
)

router.patch(
  "/:id/status/:status", 
  validateUpdateRestaurantStatusReq,
  authGuard,
  roleGuard([roles_enum.ADMIN]),
  handleUpdatedRestaurantStatusReq
)




export default router