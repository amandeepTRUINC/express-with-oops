import Joi from "joi";

export const validateFloorIdSchema = Joi.object({
  id: Joi.number().required().greater(0).message("Invalid Id")
})

export const validateCreateFloorSchema = Joi.object({
  building_id: Joi.number().required().greater(0).message("Invalid Building Id"),
  identifier: Joi.string().required().min(3),
  floor_number: Joi.number().required().greater(-1).message("Invalid floor number"),
  compay_name: Joi.string().optional()
})

export const validateUpdateFloorSchema = validateFloorIdSchema.concat(validateCreateFloorSchema)