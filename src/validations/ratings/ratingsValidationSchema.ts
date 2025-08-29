import Joi from "joi";

export const createRatingSchema = Joi.object({
  restaurant_id: Joi.number().required().positive().message("Invalid restaurant id"),
  order_id: Joi.number().optional().positive().message("Invalid order Id"),
  rating: Joi.number().required().min(1).max(5).message("Rating can only between 1 to 5"),
  comment: Joi.string().optional().max(500).message("only 500 characters are allowed")
})

export const ratingIdSchema = Joi.object({
  id: Joi.number().required().positive().message("Invalid id"),
})

export const updateRatingSchema = ratingIdSchema.concat(createRatingSchema)