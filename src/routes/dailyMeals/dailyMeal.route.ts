import { Router } from 'express'
import { validateCreateDailyMealInReq, validateGetDailyMealsReq, validateDailyMealIdInReq, validateUpdateDailyMealInReq } from '../../validations/index'
import { authGuard } from '../../guards/auth.guard'
import { handleCreateDailyMealReq, handleDeleteDailyMealReq, handleGetDailyMealDetailsReq, handleUpdateDailyMealReq } from '../../controllers/dailyMeals/dailyMeals.controller'
import { roleGuard } from '../../guards/role.guard'
import { roles_enum } from '../../interfaces/roles/roles.interface'

const router = Router()

router.get(
  '/',
  validateGetDailyMealsReq,
  authGuard,
  handleGetDailyMealDetailsReq
)


router.get(
  '/:id',
  validateDailyMealIdInReq,
  authGuard,
  handleGetDailyMealDetailsReq
)

router.post(
  '/',
  validateCreateDailyMealInReq,
  authGuard,
  roleGuard([roles_enum.RESTAURANT_OWNER]),
  handleCreateDailyMealReq
)

router.put(
  '/',
  validateUpdateDailyMealInReq,
  authGuard,
  roleGuard([roles_enum.RESTAURANT_OWNER]),
  handleUpdateDailyMealReq
)

router.delete(
  '/:id',
  validateDailyMealIdInReq,
  authGuard,
  roleGuard([roles_enum.RESTAURANT_OWNER]),
  handleDeleteDailyMealReq
)


export default router