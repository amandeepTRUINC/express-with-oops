import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "../constants/common";
import { ICustomError } from "../interfaces/common.interface";
import { IMenuCategories } from "../interfaces/menu.category.interface";
import { menuCategoryRepository } from "../repositories/menuCategory.repository";
import { CustomError } from "../utils/error";
import { handleError } from "../utils/helperFunctions";
import { restaurantService } from "./restaurants.service";
import { menuCategoryPublicFields } from "../db/commonSelectQueries";


const createCategory = async (requestBody: IMenuCategories): Promise<number | ICustomError> => {
  try {
    // checking if restaurant exists or not
    const restaurantDetails = await restaurantService.getRestaurantDetails(requestBody.restaurant_id)
    if (!restaurantDetails) {
      throw new CustomError({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: "Restaurant Not Found"
      })
    }
    // checking if category already exist for the same restaurant
    const existingCategory = await menuCategoryRepository.fetchSingleCategory({
      where: {
        restaurant_id: requestBody.restaurant_id,
        name: {
          equals: requestBody.name,
          mode: 'insensitive'
        }
      }
    })
    if (existingCategory) {
      throw new CustomError({
        status: HTTP_STATUS_CODES.ENTITY_ALREADY_EXISTS,
        message: "This Category Already exist"
      })
    }

    const categoryDetails = {
      name: requestBody.name,
      restaurant_id: requestBody.restaurant_id,
      display_order: requestBody.display_order,
      menu_items: requestBody.menu_items?.length ? requestBody.menu_items : []
    }
    const createdCategoryId = await menuCategoryRepository.createCategory(categoryDetails as Prisma.menu_categoriesCreateArgs['data'])

    return createdCategoryId
  } catch (error) {
    return handleError(error)
  }
}

const getCategoryList = async (): Promise<IMenuCategories[] | ICustomError> => {
  try {
    const categoryList = menuCategoryRepository.fetchMultipleCategory({
      orderBy: { display_order: "asc" }, select: {
        ...menuCategoryPublicFields
      }
    })
    return categoryList
  } catch (error) {
    return handleError(error)
  }
}

const getCategoryDetails = async (categoryId: number): Promise<IMenuCategories | ICustomError> => {
  try {
    const categoryDetails = menuCategoryRepository.fetchSingleCategory({
      where: {
        id: categoryId
      },
      select: {
        ...menuCategoryPublicFields
      }
    })
    if (!categoryDetails) {
      throw new CustomError({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: 'Category Not Found.'
      })
    }
    return categoryDetails
  } catch (error) {
    return handleError(error)
  }
}

const updateCategoryDetails = async (
  categoryId: number,
  requestBody: IMenuCategories
): Promise<number | ICustomError> => {
  try {
    // check if category exists
    const existingCategory = await menuCategoryRepository.fetchSingleCategory({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new CustomError({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: "Category Not Found",
      });
    }

    // build prisma update data (exclude menu_items array)
    const updateData: Prisma.menu_categoriesUpdateInput = {
      name: requestBody.name,
      is_available: requestBody.is_available,
      display_order: requestBody.display_order,
    };

    await menuCategoryRepository.updateSingleCategory({ id: categoryId }, updateData);

    return categoryId;
  } catch (error) {
    return handleError(error);
  }
};

const deleteCategory = async (categoryId: number): Promise<void | ICustomError> => {
  try {
    const existingCategory = await menuCategoryRepository.fetchSingleCategory({ where: { id: categoryId } })
    if (!existingCategory) {
      throw new CustomError({
        message: 'Category Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    await menuCategoryRepository.deleteCategory({ where: { id: categoryId } })
    return
  } catch (error) {
    return handleError(error)
  }
}


export const menuCategoryService = {
  createCategory,
  getCategoryList,
  getCategoryDetails,
  updateCategoryDetails,
  deleteCategory
}