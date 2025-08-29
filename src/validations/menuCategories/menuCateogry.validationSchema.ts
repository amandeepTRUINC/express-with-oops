import Joi from "joi";
import { createMenuItemSchema } from "../menuItems/menuItem.validationSchema";

export const createMenuCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  restaurant_id: Joi.number().integer().positive().required(),
  is_available: Joi.boolean().required(),
  display_order: Joi.number().integer().min(0).required(),
  menu_items: Joi.array().items(createMenuItemSchema).optional(),
});

export const validateMenuCategoryIdSchema = Joi.object({
  id: Joi.number().required().greater(0).message("Invalid Building Id")
})

export const updateMenuCategorySchema = validateMenuCategoryIdSchema.concat(
  Joi.object({
    name: Joi.string().trim().min(1).max(255).required(),
    restaurant_id: Joi.number().integer().positive().required(),
    is_available: Joi.boolean().required(),
    display_order: Joi.number().integer().min(0).required(),
    menu_items: Joi.array().items(createMenuItemSchema).optional(),
  })
);