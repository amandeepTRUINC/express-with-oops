import Joi from "joi";

export const createCartItemValidationSchema = Joi.object({
  user_id: Joi.number().required().greater(0).message("Invalid user id"),
  menu_item_id: Joi.number().required().greater(0).message("Invalid Menu Item Id"),
  quantity: Joi.number().required().greater(-1).message("Invalid Quantity"),
  customization: Joi.string().optional().allow(null, '').max(500)
})

export const cartItemIdValidationSchema = Joi.object({
  id: Joi.number().required().greater(0).message("Invalid Cart Item Id"),
})

export const updateCartItemValidationSchema = cartItemIdValidationSchema.concat(createCartItemValidationSchema)