import { Prisma } from "@prisma/client";
import { prisma } from "../../db/dbConnection";
import { IRating } from "../../interfaces/ratings/rating.interface";

const createRating = async (data: Prisma.restaurant_ratingsCreateArgs['data']): Promise<number> => {
  try {
    const createdRating = await prisma.restaurant_ratings.create({ data });
    return createdRating.id;
  } catch (error) {
    throw error;
  }
};

const fetchRatings = async (whereCondition: Prisma.restaurant_ratingsFindManyArgs): Promise<IRating[]> => {
  try {
    const ratingList = await prisma.restaurant_ratings.findMany(whereCondition);
    return ratingList as IRating[];
  } catch (error) {
    throw error;
  }
};

const fetchSingleRating = async (whereCondition: Prisma.restaurant_ratingsFindFirstArgs): Promise<IRating> => {
  try {
    const ratingDetails = await prisma.restaurant_ratings.findFirst(whereCondition);
    return ratingDetails as IRating;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const updateSingleRating = async (
  whereCondition: Prisma.restaurant_ratingsWhereUniqueInput,
  updatedData: Prisma.restaurant_ratingsUpdateArgs['data']
): Promise<IRating> => {
  try {
    const updatedResult = await prisma.restaurant_ratings.update({
      where: whereCondition,
      data: updatedData,
    });
    return updatedResult as IRating;
  } catch (error) {
    throw error;
  }
};

const deleteRating = async (whereCondition: Prisma.restaurant_ratingsDeleteArgs): Promise<void> => {
  try {
    await prisma.restaurant_ratings.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const ratingRepository = {
  createRating,
  fetchRatings,
  fetchSingleRating,
  updateSingleRating,
  deleteRating
};
