import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../../constants/common";
import { IRating } from "../../interfaces/ratings/rating.interface";
import { ICustomError } from "../../interfaces/shared/common.interface";
import { ratingRepository } from "../../repositories/ratings/ratings.repository";
import { CustomError } from "../../utils/error";
import { handleError } from "../../utils/helperFunctions";
import { orderService } from "../orders/order.service";
import { restaurantService } from "../restaurants/restaurants.service";

const createRating = async (reqBody: IRating): Promise<number | ICustomError> => {
  try {
    // checking if restaurant exists or not
    const restaurantDetails = restaurantService.getRestaurantDetails(reqBody.restaurant_id)
    if (!restaurantDetails) {
      throw new CustomError({
        message: 'Restaurant Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    if (reqBody.order_id) {
      // checking if order exists or not
      const orderDetails = await orderService.getOrderDetails(reqBody.order_id)
      if (!orderDetails) {
        throw new CustomError({
          message: "Order Not Found",
          status: HTTP_STATUS_CODES.NOT_FOUND
        })
      }
    }
    const ratingId = await ratingRepository.createRating(reqBody)
    return ratingId
  } catch (error) {
    return handleError(error)
  }
}

const getRatingList = async (whereCondtion: Prisma.restaurant_ratingsFindManyArgs): Promise<IRating[] | ICustomError> => {
  try {
    const ratingList = await ratingRepository.fetchRatings(whereCondtion)
    return ratingList
  } catch (error) {
    return handleError(error)
  }
}


const updateRating = async (ratingId: number, reqBody: IRating): Promise<number | ICustomError> => {
  try {
    // checking if rating id exist or not
    const ratingDetails = await ratingRepository.fetchSingleRating({ where: {
      id: ratingId
    }})
    if (!ratingDetails) {
      throw new CustomError({
        message: 'Rating not found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    const updatedDetails = {
      comment: reqBody.comment,
      rating: reqBody.rating
    }
    await ratingRepository.updateSingleRating({
      id: ratingId
    }, {
      ...updatedDetails
    })
    return ratingDetails.id as number
  } catch (error) {
    return handleError(error)
  }
}


const deleteRating = async (ratingId: number, userId: number): Promise<void | ICustomError> => {
  try {
    const ratingDetails = await ratingRepository.fetchSingleRating({ where: {
      id: ratingId
    }})
    if (ratingDetails) {
      await ratingRepository.deleteRating({
        where: {
          id: ratingId,
          user_id: userId
        }
      })
    }
  } catch (error) {
    return handleError(error)
  }
}



export const ratingService = {
  createRating,
  getRatingList,
  updateRating,
  deleteRating
}