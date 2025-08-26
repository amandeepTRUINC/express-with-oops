import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../constants/common";
import { ICustomError } from "../interfaces/common.interface";
import { IDailyMeals } from "../interfaces/dailyMeals.interface";
import { dailyMealsRepository } from "../repositories/dailyMeals.repository";
import { CustomError } from "../utils/error";
import { handleError } from "../utils/helperFunctions";
import { menuItemService } from "./menuItem.service";
import { restaurantService } from "./restaurants.service";

const createDailyMeal = async (requestBody: IDailyMeals): Promise<number | ICustomError> => {
  try {
    // checking if restaurant exists or not
    const restauratnDetails = await restaurantService.getRestaurantDetails(requestBody.restaurant_id)
    if (!restauratnDetails) {
      throw new CustomError({
        message: "Restaurant not found",
        status: HTTP_STATUS_CODES.NOT_FOUND,
      })
    }
    // checking if Menu Item exists or not
    if (requestBody.menu_item_id) {
      const menuItemDetails = await menuItemService.getMenuItemDetails(requestBody.menu_item_id)
      if (!menuItemDetails) {
        throw new CustomError({
          message: "Menu Item not found",
          status: HTTP_STATUS_CODES.NOT_FOUND,
        })
      }
    }
    const mealDetails = {
      restaurant_id: requestBody.restaurant_id,
      menu_item_id: requestBody.menu_item_id || null,
      available_on: requestBody.available_on,
      is_featured: requestBody.is_featured || false,
      meal_type: requestBody.meal_type,
      description: requestBody.description
    }
    const createdMealId = await dailyMealsRepository.createMeal(mealDetails)
    return createdMealId
  } catch (error) {
    return handleError(error)
  }
}

const getDailyMeals = async (whereCondition: Prisma.daily_mealsFindManyArgs): Promise<IDailyMeals[] | ICustomError> => {
  try {
    const mealsList = await dailyMealsRepository.fetchMeals({
      where: {
        restaurant_id: whereCondition.where?.restaurant_id,
      }
    })
    return mealsList
  } catch (error) {
    return handleError(error)
  }
}

const getMealDetails = async (whereCondition: Prisma.daily_mealsFindFirstArgs): Promise<IDailyMeals | ICustomError> => {
  try {
    const mealDetails = await dailyMealsRepository.fetchMealDetails(whereCondition)
    return mealDetails
  } catch (error) {
    return handleError(error)
  }
}

const updateDailyMeal = async (mealId: number, requestBody: IDailyMeals): Promise<number | ICustomError> => {
  try {
    // checking if restaurant exists or not
    const restauratnDetails = await restaurantService.getRestaurantDetails(requestBody.restaurant_id)
    if (!restauratnDetails) {
      throw new CustomError({
        message: "Restaurant not found",
        status: HTTP_STATUS_CODES.NOT_FOUND,
      })
    }
    // checking if Menu Item exists or not
    if (requestBody.menu_item_id) {
      const menuItemDetails = await menuItemService.getMenuItemDetails(requestBody.menu_item_id)
      if (!menuItemDetails) {
        throw new CustomError({
          message: "Menu Item not found",
          status: HTTP_STATUS_CODES.NOT_FOUND,
        })
      }
    }
    const mealDetails = {
      restaurant_id: requestBody.restaurant_id,
      menu_item_id: requestBody.menu_item_id || null,
      available_on: requestBody.available_on,
      is_featured: requestBody.is_featured || false,
      meal_type: requestBody.meal_type,
      description: requestBody.description
    }
    const updatedMealId = await dailyMealsRepository.updateSingleMeal({ id: mealId }, mealDetails)
    return updatedMealId
  } catch (error) {
    return handleError(error)
  }



}

const deleteDailyMeal = async (mealId: number): Promise<void | ICustomError> => {
  try {
    const mealDetails = await getMealDetails({ where: { id: mealId } })
    if (!mealDetails) {
      throw new CustomError({
        message: "Meal not found",
        status: HTTP_STATUS_CODES.NOT_FOUND,
      })
    }
    await dailyMealsRepository.deleteMeal({ where: { id: mealId } })
  } catch (error) {
    return handleError(error)
  }
}


export const dailyMealsService = {
  createDailyMeal,
  getDailyMeals,
  getMealDetails,
  updateDailyMeal,
  deleteDailyMeal
}