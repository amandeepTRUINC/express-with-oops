import { Router } from 'express';

import { validateCreateUserReq, validateLoginUserReq, validateUpdateUserReq, validateUpdateUserStatusReq, validateUserIdInReq } from '../validations/index';
import { handleGetAllUsers, handleGetUserDetails, handleCreateUser, handleUpdateUser, handleDeleteUser, handleUpdateUserRole } from '../controller/user.controllers';
import { handleLoginReq } from '../controller/auth.controller';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { roles_enum } from '../interfaces/roles.interface';

const router = Router();

router.get('/',
  authGuard,
  roleGuard([roles_enum.ADMIN, roles_enum.RESTRAUNT_OWNER]),
  handleGetAllUsers
)

router.get(
  '/:id',
  authGuard,
  validateUserIdInReq,
  handleGetUserDetails
)

router.post('/',
  validateCreateUserReq,
  handleCreateUser
)

router.put('/',
  authGuard,
  validateUpdateUserReq,
  handleUpdateUser
)

router.delete('/:id',
  authGuard,
  validateUserIdInReq,
  handleDeleteUser
)

router.post('/login',
  validateLoginUserReq,
  handleLoginReq
)

router.patch('/:id/status/:status',
  roleGuard([roles_enum.ADMIN]),
  validateUpdateUserStatusReq,
  handleUpdateUserRole
)

export default router;