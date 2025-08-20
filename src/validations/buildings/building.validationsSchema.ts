import Joi from "joi";


export const createBuildingSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  address: Joi.string().required().min(3).max(400),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  restaurant_id: Joi.number().optional()
})

export const validateBuildingIdSchema = Joi.object({
  id: Joi.number().required().greater(0).message("Invalid Building Id")
})

export const updateBuildingSchema = Joi.object({
  id: Joi.number().required().greater(0).message("Invalid Building Id"),
  name: Joi.string().required().min(3).max(100),
  address: Joi.string().required().min(3).max(400),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  restaurant_id: Joi.number().required()
})