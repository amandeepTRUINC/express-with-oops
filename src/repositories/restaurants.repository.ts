import { Prisma } from "@prisma/client";
import { prisma } from "../db/dbConnection";
import { IRestaurant } from "../interfaces/restaurants.interface";


// Create a new restaurant
const createRestaurant = async (
  data: Prisma.restaurantsCreateArgs['data']
): Promise<number> => {
  try {
    const restaurant = await prisma.restaurants.create({ data });
    return restaurant.id;
  } catch (error) {
    throw error;
  }
};

// Fetch multiple restaurants
const fetchMultipleRestaurants = async (
  whereCondition: Prisma.restaurantsFindManyArgs
): Promise<IRestaurant[]> => {
  try {
    const restaurants = await prisma.restaurants.findMany(whereCondition);
    return restaurants as unknown as IRestaurant[];
  } catch (error) {
    throw error;
  }
};

// Fetch a single restaurant
const fetchSingleRestaurant = async (
  whereCondition: Prisma.restaurantsFindFirstArgs
): Promise<IRestaurant> => {
  try {
    const restaurant = await prisma.restaurants.findFirst(whereCondition);
    return restaurant as unknown as IRestaurant;
  } catch (error) {
    throw error;
  }
};

// Update multiple restaurants
const updateMultipleRestaurants = async (
  whereCondition: Prisma.restaurantsWhereInput,
  data: Prisma.restaurantsUpdateManyArgs['data']
): Promise<number> => {
  try {
    const result = await prisma.restaurants.updateMany({
      where: whereCondition,
      data,
    });
    return result.count;
  } catch (error) {
    throw error;
  }
};

// Update a single restaurant
const updateSingleRestaurant = async (
  where: Prisma.restaurantsWhereUniqueInput,
  data: Prisma.restaurantsUpdateArgs['data']
): Promise<IRestaurant> => {
  try {
    const updated = await prisma.restaurants.update({
      where,
      data,
    });
    return updated as unknown as IRestaurant;
  } catch (error) {
    throw error;
  }
};

// Delete a restaurant
const deleteRestaurant = async (
  whereCondition: Prisma.restaurantsDeleteArgs
): Promise<void> => {
  try {
    await prisma.restaurants.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const restaurantRepository = {
  createRestaurant,
  fetchMultipleRestaurants,
  fetchSingleRestaurant,
  updateMultipleRestaurants,
  updateSingleRestaurant,
  deleteRestaurant,
};
