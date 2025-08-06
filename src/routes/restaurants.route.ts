import { Router } from 'express'
import { validateCreateRestaurantReq } from '../validations'
import { authGuard } from '../guards/auth.guard'
import { roleGuard } from '../guards/role.guard'
import { roles_enum } from '../interfaces/roles.interface'
import { handleCreateRestaurantReq, handleGetRestaurantListReq } from '../controller/restaurant.controller'

const router = Router()

router.post(
  '/',
  validateCreateRestaurantReq,
  authGuard,
  roleGuard([roles_enum.ADMIN]),
  handleCreateRestaurantReq
)

router.get(
  '/',
  authGuard,
  roleGuard([roles_enum.ADMIN]),
  handleGetRestaurantListReq
)





export default router