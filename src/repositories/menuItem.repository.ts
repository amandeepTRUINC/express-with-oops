import { Prisma } from "@prisma/client";
import { IMenuItem } from '../interfaces/menuItem.interface'
import { prisma } from "../db/dbConnection";

const createMenuItem = async (data: Prisma.menu_itemsCreateArgs['data']): Promise<number> => {
  try {
    const createdMenuItem = await prisma.menu_items.create({ data });
    return createdMenuItem.id;
  } catch (error) {
    throw error;
  }
};

const fetchMultipleMenuItems = async (whereCondition: Prisma.menu_itemsFindManyArgs): Promise<IMenuItem[]> => {
  try {
    const menuItemDetails = await prisma.menu_items.findMany(whereCondition);
    return menuItemDetails as IMenuItem[];
  } catch (error) {
    throw error;
  }
};

const fetchSingleMenuItem = async (whereCondition: Prisma.menu_itemsFindFirstArgs): Promise<IMenuItem> => {
  try {
    const menuItemDetails = await prisma.menu_items.findFirst(whereCondition);
    return menuItemDetails as IMenuItem;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const updateMultipleMenuItems = async (
  whereCondition: Prisma.menu_itemsWhereInput,
  updatedData: Prisma.menu_itemsUpdateManyArgs['data']
): Promise<number> => {
  try {
    const updatedResult = await prisma.menu_items.updateMany({
      where: { ...whereCondition },
      data: updatedData,
    });
    return updatedResult.count;
  } catch (error) {
    throw error;
  }
};

const updateSingleMenuItem = async (
  whereCondition: Prisma.menu_itemsWhereUniqueInput,
  updatedData: Prisma.menu_itemsUpdateArgs['data']
): Promise<IMenuItem> => {
  try {
    const updatedResult = await prisma.menu_items.update({
      where: whereCondition,
      data: updatedData,
    });
    return updatedResult as IMenuItem;
  } catch (error) {
    throw error;
  }
};

const deleteMenuItems = async (whereCondition: Prisma.menu_itemsDeleteArgs): Promise<void> => {
  try {
    await prisma.menu_items.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const menuItemRepository = {
  createMenuItem,
  fetchMultipleMenuItems,
  fetchSingleMenuItem,
  updateMultipleMenuItems,
  updateSingleMenuItem,
  deleteMenuItems,
};
