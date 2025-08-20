import Joi from "joi";

export const validateMenuItemIdSchema = Joi.object({
    id: Joi.number().integer().positive().optional(),
})

export const createMenuItemSchema = Joi.object({

  restaurant_id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().min(1).max(255).required(),
  category_id: Joi.number().integer().positive().required(),
  description: Joi.string().allow("").max(1000).required(),
  price: Joi.number().precision(2).positive().required(),
  is_available: Joi.boolean().required(),
  is_veg: Joi.boolean().required(),
  image_url: Joi.string().uri().max(2048).required(),
  preparation_time: Joi.number().integer().min(0).required(),
  customizable: Joi.boolean().required(),
});

export const updateMenuItemSchema = validateMenuItemIdSchema.concat(
  Joi.object({
    restaurant_id: Joi.number().integer().positive().required(),
    name: Joi.string().trim().min(1).max(255).required(),
    category_id: Joi.number().integer().positive().required(),
    description: Joi.string().allow("").max(1000).required(),
    price: Joi.number().precision(2).positive().required(),
    is_available: Joi.boolean().required(),
    is_veg: Joi.boolean().required(),
    image_url: Joi.string().uri().max(2048).required(),
    preparation_time: Joi.number().integer().min(0).required(),
    customizable: Joi.boolean().required(),
  })
)