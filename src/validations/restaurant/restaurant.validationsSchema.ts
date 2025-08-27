import Joi from "joi";
import { enum_restaurant_approval_status } from "../../interfaces/restaurants/restaurants.interface";

export const createRestaurantValidationsSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  address: Joi.string().trim().min(5).max(255).required(),
  contact_number: Joi.string()
    .pattern(/^(	1[\-\s]?)?[0]?(91)?[789]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Contact number must be a 10-digit number.',
    }),
  commission_rate: Joi.number().optional(),
  estimated_prep_time: Joi.number().optional(),
  owner_info: Joi.object({
    full_name: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    phone_number: Joi.string().required().length(10).pattern(/^(	1[\-\s]?)?[0]?(91)?[789]\d{9}$/),
  })
})

export const updateRestaurantValidationsSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  address: Joi.string().trim().min(5).max(255).required(),
  contact_number: Joi.string()
    .pattern(/^(	1[\-\s]?)?[0]?(91)?[789]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Contact number must be a 10-digit number.',
    })
})

export const updateRestaurantStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(enum_restaurant_approval_status))
    .required()
})