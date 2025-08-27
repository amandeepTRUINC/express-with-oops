import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../../constants/common";
import { ICustomError } from "../../interfaces/shared/common.interface";
import { IMenuItem } from "../../interfaces/menuItems/menuItem.interface";
import { menuItemRepository } from "../../repositories/menuItems/menuItem.repository";
import { CustomError } from "../../utils/error";
import { handleError } from "../../utils/helperFunctions";
import { menuCategoryService } from "../menuCategories/menuCategory.service";
import { restaurantService } from "../restaurants/restaurants.service";

const createMenuItem = async (requestBody: IMenuItem): Promise<number | ICustomError> => {

  try {
    // chcking if restaurant exist or not
    const restaurantDetails = await restaurantService.getRestaurantDetails(requestBody.restaurant_id)
    if (!restaurantDetails) {
      throw new CustomError({
        message: 'Restaurant Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    // checking if category exists or not
    const categoryDetails = await menuCategoryService.getCategoryDetails(requestBody.category_id)
    if (!categoryDetails) {
      throw new CustomError({
        message: 'Category Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    // checking if item with same name already exists
    const existingMenuItem = await menuItemRepository.fetchSingleMenuItem({
      where: {
        name: {
          equals: requestBody.name,
          mode: 'insensitive'
        }
      }
    })
    if (existingMenuItem) {
      throw new CustomError({
        message: 'Menu item already exists',
        status: HTTP_STATUS_CODES.ENTITY_ALREADY_EXISTS
      })
    }
    const menuItemId = await menuItemRepository.createMenuItem(requestBody)
    return menuItemId
  } catch (error) {
    return handleError(error)
  }
}
const getMenuItemList = async (whereCondition: Prisma.menu_itemsFindManyArgs): Promise<IMenuItem[] | ICustomError> => {
  try {
    const itemList = await menuItemRepository.fetchMultipleMenuItems(whereCondition)
    return itemList
  } catch (error) {
    return handleError(error)
  }
}

const getMenuItemDetails = async (menuItemId: number): Promise<IMenuItem | ICustomError> => {
  try {
    const itemDetails = await menuItemRepository.fetchSingleMenuItem({
      where: {
        id: menuItemId
      }
    })
    return itemDetails
  } catch (error) {
    return handleError(error)
  }
}

const updateMenuItemDetails = async (menuItemId: number, requestBody: IMenuItem): Promise<number | ICustomError> => {
  try {
    // chcking if restaurant exist or not
    const restaurantDetails = await restaurantService.getRestaurantDetails(requestBody.restaurant_id)
    if (!restaurantDetails) {
      throw new CustomError({
        message: 'Restaurant Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    // checking if category exists or not
    const categoryDetails = await menuCategoryService.getCategoryDetails(requestBody.category_id)
    if (!categoryDetails) {
      throw new CustomError({
        message: 'Category Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    // checking if item with same name already exists
    const existingMenuItem = await menuItemRepository.fetchSingleMenuItem({
      where: {
        id: menuItemId
      }
    })
    if (!existingMenuItem) {
      throw new CustomError({
        message: 'Menu Item Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    existingMenuItem.name = requestBody.name
    existingMenuItem.category_id = requestBody.category_id
    existingMenuItem.description = requestBody.description
    existingMenuItem.price = requestBody.price
    existingMenuItem.is_available = requestBody.is_available
    existingMenuItem.is_veg = requestBody.is_veg
    existingMenuItem.preparation_time = requestBody.preparation_time
    existingMenuItem.customizable = requestBody.customizable
    existingMenuItem.image_url = requestBody.image_url
    await menuItemRepository.updateSingleMenuItem({ id: existingMenuItem.id }, existingMenuItem)
    return existingMenuItem.id as number
  } catch (error) {
    return handleError(error)
  }
}

const deleteMenuItem = async (itemId: number): Promise<void | ICustomError> => {
  try {
    const existingItem = menuItemRepository.fetchSingleMenuItem({ where: { id: itemId } })
    if (!existingItem) {
      throw new CustomError({
        message: "Menu Item not found",
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    await menuItemRepository.deleteMenuItems({
      where: {
        id: itemId
      }
    })
  } catch (error) {
    return handleError(error)
  }
}

export const menuItemService = {
  createMenuItem,
  getMenuItemList,
  getMenuItemDetails,
  updateMenuItemDetails,
  deleteMenuItem
}