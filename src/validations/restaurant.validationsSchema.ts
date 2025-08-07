import Joi from "joi";
import { enum_restaurant_approval_status } from "../interfaces/restaurants.interface";

export const createRestaurantValidationsSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  address: Joi.string().trim().min(5).max(255).required(),
  contact_number: Joi.string()
    .pattern(/^(	1[\-\s]?)?[0]?(91)?[789]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Contact number must be a 10-digit number.',
    }),
  owner_id: Joi.number().integer().positive().required(),
  is_active: Joi.boolean().required(),
  approval_status: Joi.string()
    .valid(...Object.values(enum_restaurant_approval_status))
    .required(),
  commission_rate: Joi.number().min(0).max(100).required(),
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