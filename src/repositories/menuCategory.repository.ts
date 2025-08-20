import { Prisma } from "@prisma/client";
import { prisma } from "../db/dbConnection";
import { IMenuCategory } from "../interfaces/menuCategory.interface";

const createCategory = async (
  data: Prisma.menu_categoriesCreateArgs['data']
): Promise<number> => {
  try {
    const category = await prisma.menu_categories.create({ data });
    return category.id;
  } catch (error) {
    throw error;
  }
};

// Fetch multiple menuCategory
const fetchMultipleCategory = async (
  whereCondition: Prisma.menu_categoriesFindManyArgs
): Promise<IMenuCategory[]> => {
  try {
    const menuCategoryList = await prisma.menu_categories.findMany(whereCondition);
    return menuCategoryList as unknown as IMenuCategory[];
  } catch (error) {
    throw error;
  }
};

// Fetch a single restaurant
const fetchSingleCategory = async (
  whereCondition: Prisma.menu_categoriesFindFirstArgs
): Promise<IMenuCategory> => {
  try {
    const restaurant = await prisma.menu_categories.findFirst(whereCondition);
    return restaurant as unknown as IMenuCategory;
  } catch (error) {
    throw error;
  }
};

// Update multiple menuCategory
const updateMultipleCategories = async (
  whereCondition: Prisma.menu_categoriesWhereInput,
  data: Prisma.menu_categoriesUpdateManyArgs['data']
): Promise<number> => {
  try {
    const result = await prisma.menu_categories.updateMany({
      where: whereCondition,
      data,
    });
    return result.count;
  } catch (error) {
    throw error;
  }
};

// Update a single restaurant
const updateSingleCategory = async (
  where: Prisma.menu_categoriesWhereUniqueInput,
  data: Prisma.menu_categoriesUpdateInput
): Promise<IMenuCategory> => {
  try {
    const updated = await prisma.menu_categories.update({
      where,
      data,
    });
    return updated as unknown as IMenuCategory;
  } catch (error) {
    throw error;
  }
};

// Delete a restaurant
const deleteCategory= async (
  whereCondition: Prisma.menu_categoriesDeleteArgs
): Promise<void> => {
  try {
    await prisma.menu_categories.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const menuCategoryRepository = {
  createCategory,
  fetchMultipleCategory,
  fetchSingleCategory,
  updateMultipleCategories,
  updateSingleCategory,
  deleteCategory,
};
