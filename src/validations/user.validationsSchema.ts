import Joi from "joi";

const validateUserIdSchema = Joi.object({
  id: Joi.number().required().integer()
})

const createUserValidationsSchema = Joi.object({
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

const updateUserValidationsSchema = Joi.object({
  id: Joi.number().required().greater(0),
  full_name: Joi.string().required().min(3).max(30),
  email: Joi.string().required().email(),
  phone_number: Joi.string().required().length(10).pattern(/^(	1[\-\s]?)?[0]?(91)?[789]\d{9}$/),
});

const validateLoginUserReqSchema = Joi.object({
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

export { validateUserIdSchema, createUserValidationsSchema, updateUserValidationsSchema, validateLoginUserReqSchema };
