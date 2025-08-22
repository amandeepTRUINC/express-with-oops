import { Router } from "express";
import { authGuard } from "../guards/auth.guard";
import { handleDeleteFloorReq, handleGetFloorDetailsReq, handleGetFloorListReq, handleUpdateFloorReq } from "../controller/floor.controller";
import { validateCreateFloorInReq, validateFloorIdInReq, validateUpdateFloorInReq } from "../validations";
import { roleGuard } from "../guards/role.guard";
import { roles_enum } from "../interfaces/roles.interface";

const router = Router()

router.get(
  '/',
  authGuard,
  handleGetFloorListReq
)

router.get(
  '/:id',
  validateFloorIdInReq,
  authGuard,
  handleGetFloorDetailsReq
)

router.post(
  '/',
  validateCreateFloorInReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleGetFloorDetailsReq
)

router.put(
  '/',
  validateUpdateFloorInReq,
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTAURANT_OWNER]),
  handleUpdateFloorReq
)

router.delete(
  '/:id',
  validateFloorIdInReq,
  authGuard,
  roleGuard([roles_enum.ADMIN]),
  handleDeleteFloorReq
)



export default router