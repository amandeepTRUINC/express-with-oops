import { Prisma } from "@prisma/client";
import { IDailyMeals } from "../../interfaces/dailyMeals/dailyMeals.interface";
import { prisma } from "../../db/dbConnection";

const createMeal = async (userDetails: Prisma.daily_mealsCreateArgs['data']): Promise<number> => {
  try {
    const createdUser = await prisma.daily_meals.create({ data: userDetails });
    return createdUser.id;
  } catch (error) {
    throw error;
  }
};

const fetchMeals = async (whereCondition: Prisma.daily_mealsFindManyArgs): Promise<IDailyMeals[]> => {
  try {
    const daily_mealsList = await prisma.daily_meals.findMany(whereCondition);
    return daily_mealsList as unknown as IDailyMeals[]
  } catch (error) {
    throw error;
  }
};

const fetchMealDetails = async (whereCondition: Prisma.daily_mealsFindFirstArgs): Promise<IDailyMeals> => {
  try {
    const userDetails = await prisma.daily_meals.findFirst(whereCondition);
    return userDetails as unknown as IDailyMeals;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const updateMultipleMeals = async (
  whereCondition: Prisma.daily_mealsWhereInput,
  updatedData: Prisma.daily_mealsUpdateManyArgs['data']
): Promise<number> => {
  try {
    const updatedResult = await prisma.daily_meals.updateMany({
      where: { ...whereCondition },
      data: updatedData,
    });
    return updatedResult.count;
  } catch (error) {
    throw error;
  }
};

const updateSingleMeal = async (
  whereCondition: Prisma.daily_mealsWhereUniqueInput,
  updatedData: Prisma.daily_mealsUpdateArgs['data']
): Promise<number> => {
  try {
    const updatedResult = await prisma.daily_meals.update({
      where: whereCondition,
      data: updatedData,
    });
    return updatedResult.id;
  } catch (error) {
    throw error;
  }
};

const deleteMeal = async (whereCondition: Prisma.daily_mealsDeleteArgs): Promise<void> => {
  try {
    await prisma.daily_meals.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const dailyMealsRepository = {
  createMeal,
  fetchMeals,
  fetchMealDetails,
  updateMultipleMeals,
  updateSingleMeal,
  deleteMeal,
};
