import Joi from "joi";
import { order_status_enum, order_type_enum } from "../../interfaces/orders/order.interface";

export const createOrderValidationSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  restaurant_id: Joi.number().integer().positive().required(),
  items: Joi.array().items(
    Joi.object({
      menu_item_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().min(1).required(),
      special_instructions: Joi.string().max(500).allow("").optional(),
    })
  ).min(1).required(),
  delivery_address: Joi.string().max(500).required(),
  order_type: Joi.string().valid(Object.values(order_type_enum)).required(),
})

export const orderIdValidationSchema = Joi.object({
  id: Joi.number().integer().positive().required()
})

export const orderStatusValidationSchema = orderIdValidationSchema.concat(
  Joi.object({
    status: Joi.string().valid(Object.values(order_status_enum)).required(),
  })
)