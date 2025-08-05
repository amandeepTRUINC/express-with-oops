import { Router } from 'express';

import { validateCreateUserReq, validateLoginUserReq, validateUpdateUserReq, validateUserIdInReq } from '../validations/index';
import { handleGetAllUsers, handleGetUserDetails, handleCreateUser, handleUpdateUser, handleDeleteUser } from '../controller/user.controllers';
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

router.patch('/:id',
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

export default router;