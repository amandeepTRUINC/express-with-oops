import Joi from "joi";

export const createDailMealValidationSchema = Joi.object({
  restaurant_id: Joi.number().required(),
  menu_item_id: Joi.number().optional().greater(0).message("Invalid Menu Item Id"),
  available_on: Joi.date().optional(),
  is_featured: Joi.boolean().optional(),
  meal_type: Joi.string().valid("BREAKFAST", "LUNCH", "DINNER").required(),
  description: Joi.string().required() 
})

export const validateMealIdSchema = Joi.object({
  id: Joi.number().required().greater(0).message("Invalid Id")
})

export const validateUpdateDailyMealSchema = validateMealIdSchema.concat(createDailMealValidationSchema)

export const validateGetDailyMealsSchema = Joi.object({
  restaurant_id: Joi.number().required().greater(0).message("Invalid Restaurant Id"),
})