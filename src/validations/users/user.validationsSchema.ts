import Joi from "joi";
import { roles_enum } from "../../interfaces/roles/roles.interface";

export const validateUserIdSchema = Joi.object({
  id: Joi.number().required().integer()
})

export const createUserValidationsSchema = Joi.object({
  full_name: Joi.string().required().min(3).max(30),
  email: Joi.string().required().email(),
  phone_number: Joi.string().required().length(10).pattern(/^(	1[\-\s]?)?[0]?(91)?[789]\d{9}$/),
  password: Joi.string().required()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .message(
      'Password must be at least 8 characters long and include at least one letter and one number.'
    )
    .required()
})

export const updateUserValidationsSchema = Joi.object({
  id: Joi.number().required().greater(0),
  full_name: Joi.string().required().min(3).max(30),
  email: Joi.string().required().email(),
  phone_number: Joi.string().required().length(10).pattern(/^(	1[\-\s]?)?[0]?(91)?[789]\d{9}$/),
});

export const validateLoginUserReqSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .custom((value, helpers) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isMobile = /^\d{10}$/.test(value); // adjust for your format

      if (!isEmail && !isMobile) {
        return helpers.error('any.invalid', { message: 'Identifier must be a valid email or 10-digit mobile number' });
      }

      return value;
    }),
  password: Joi.string().min(6).required(), // adjust rules as needed
});

export const validateUpdateStatusSchema = Joi.object({
  id: Joi.number().required().greater(0),
  status: Joi.string()
    .valid(...Object.values(roles_enum))
    .required()
});


export const validateSearchUserSchema = Joi.object({
  param: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isName = /^[a-zA-Z\s]+$/.test(value); // letters + spaces only

      if (!isEmail && !isName) {
        return helpers.error("any.invalid", {
          message:
            "Identifier must be a valid email or name",
        });
      }
      return value;
    }),
});