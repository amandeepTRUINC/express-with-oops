import { Router } from 'express';

import userValidations from '../validations/user.validations';
import userController from '../controller/user.controllers';

const router = Router();

router.get('/',
  userController.getAllUser,
)

router.get(
  '/:id',
  userValidations.validateUserIdInReq(),
  userController.getUserDetails
)

router.post('/',
  userValidations.validateCreateUserReq(),
  userController.createUser
)

router.patch("/:id",
  userValidations.validateUpdateUserReq(),
  userController.updateUser
)

router.delete("/:id",
  userValidations.validateUserIdInReq(),
  userController.deleteUser
)

export default router;