import { Router } from 'express'
import { authGuard } from '../../guards/auth.guard'
import { handleCreateRatingReq, handleGetRatingsReq, handleDeleteRatingReq, handleUpdateRatingReq } from '../../controllers/ratings/rating.controller'
import { validateCreateRatingInReq, validateRatingIdInReq, validateUpdateRatingInReq } from '../../validations'

const router = Router()

router.get(
  '/',
  authGuard,
  handleGetRatingsReq
)

router.post(
  '/',
  validateCreateRatingInReq,
  authGuard,
  handleCreateRatingReq
)


router.put(
  '/',
  validateUpdateRatingInReq,
  authGuard,
  handleUpdateRatingReq
)

router.delete(
  '/:id',
  validateRatingIdInReq,
  authGuard,
  handleDeleteRatingReq
)


export default router