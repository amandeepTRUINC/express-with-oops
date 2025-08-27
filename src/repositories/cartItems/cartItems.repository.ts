import { Prisma } from "@prisma/client";

import { prisma } from "../../db/dbConnection";
import { ICartItems } from "../../interfaces/cartItems/cartItems.interface";

const createCartItem = async (details: Prisma.cart_itemsCreateArgs['data']): Promise<number> => {
  try {
    const createdCart = await prisma.cart_items.create({ data: details });
    return createdCart.id;
  } catch (error) {
    throw error;
  }
};

const fetchCartList = async (whereCondition: Prisma.cart_itemsFindManyArgs): Promise<ICartItems[]> => {
  try {
    const cartList = await prisma.cart_items.findMany(whereCondition);
    return cartList as ICartItems[];
  } catch (error) {
    throw error;
  }
};

const fetchCartDetails = async (whereCondition: Prisma.cart_itemsFindFirstArgs): Promise<ICartItems> => {
  try {
    const cartDetails = await prisma.cart_items.findFirst(whereCondition);
    return cartDetails as ICartItems;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const updateCartItems = async (
  whereCondition: Prisma.cart_itemsWhereUniqueInput,
  updatedData: Prisma.cart_itemsUpdateArgs['data']
): Promise<ICartItems> => {
  try {
    const updatedResult = await prisma.cart_items.update({
      where: whereCondition,
      data: updatedData,
    });
    return updatedResult as ICartItems;
  } catch (error) {
    throw error;
  }
};

const deleteCartItems = async (whereCondition: Prisma.cart_itemsDeleteArgs): Promise<void> => {
  try {
    await prisma.cart_items.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const cartRepository = {
  createCartItem,
  fetchCartList,
  fetchCartDetails,
  updateCartItems,
  deleteCartItems,
};
