import Joi from "joi";
import { IUserValdaitions } from "../common/interfaces/user.interface";
import { BaseValidator } from "../base/base.validator";
import { IHelperFunctions } from "../common/interfaces/common.interface";
import { helperFunctions } from "../utils/helperFunctions";


class UserValidations extends BaseValidator implements IUserValdaitions {

  constructor(helperFunctions: IHelperFunctions) {
    super(helperFunctions)
  }
  public validateUserIdInReq () {
    const schema = Joi.object({
      id: Joi.number().required().integer()
    })
    return this.getRequestErrors(schema)
  }

  public validateCreateUserReq () {
    const schema = Joi.object({
      full_name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().email(),
      phone_number: Joi.string().required().length(10).pattern(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/),
      password: Joi.string().required()
        .min(8)
        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
        .message(
          'Password must be at least 8 characters long and include at least one letter and one number.'
        )
        .required()
    })
    return this.getRequestErrors(schema)
  }

    public validateUpdateUserReq () {
    const schema = Joi.object({
      id: Joi.number().required().greater(0),
      full_name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().email(),
      phone_number: Joi.string().required().length(10).pattern(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/),
    })
    return this.getRequestErrors(schema)
  }

}

export default new UserValidations(helperFunctions)