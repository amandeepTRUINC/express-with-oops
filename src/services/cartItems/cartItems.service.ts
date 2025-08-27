import { Prisma } from "@prisma/client";
import { ICartItems } from "../../interfaces/cartItems/cartItems.interface";
import { ICustomError } from "../../interfaces/shared/common.interface";
import { cartRepository } from "../../repositories/cartItems/cartItems.repository";
import { handleError } from "../../utils/helperFunctions";
import { CustomError } from "../../utils/error";
import { HTTP_STATUS_CODES } from "../../constants/common";
import { menuItemService } from "../menuItems/menuItem.service";
import { cartItemDetailsPublicFields } from "../../db/commonSelectQueries";

const createCartItem = async (details: ICartItems): Promise<number | ICustomError> => {
  try {
    // checking if item already exists in cart for user, if YES then update the quantity
    const existingCartItem = await cartRepository.fetchCartDetails({
      where: {
        user_id: details.user_id,
        menu_item_id: details.menu_item_id
      }
    })
    if (existingCartItem) {
      const updatedQuantity = existingCartItem.quantity + details.quantity
      const updatedCartItem = await cartRepository.updateCartItems(
        { id: existingCartItem.id },
        { quantity: updatedQuantity }
      )
      return updatedCartItem.id as number
    } else {
      const createdCartId = await cartRepository.createCartItem(details)
      return createdCartId
    }
  } catch (error) {
    return handleError(error)
  }
}

const getCartItemsList = async (whereCondition: Prisma.cart_itemsWhereInput): Promise<ICartItems[] | ICustomError> => {
  try {
    const cartList = await cartRepository.fetchCartList({
      where: whereCondition
    });
    return cartList;
  } catch (error) {
    return handleError(error)
  }
}

const getCartDetails = async (cartId: number): Promise<ICartItems | ICustomError> => {
  try {
    const cartDetails = await cartRepository.fetchCartDetails({
      where: {
        id: cartId
      },
      select: {
        ...cartItemDetailsPublicFields
      }
    })
    return cartDetails
  } catch (error) {
    return handleError(error)
  }
}

const updateCartDetails = async (cartId: number, requestBody: ICartItems): Promise<number | ICustomError> => {
  try {
    // checking if cart item exist
    const existingCartDetails = await cartRepository.fetchCartDetails({
      where: {
        id: cartId
      }
    })
    if (!existingCartDetails) {
      throw new CustomError({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: 'Cart Item Not Found'
      })
    }
    // checking if menu item id exist or not
    const menuItemDetails = await menuItemService.getMenuItemDetails(requestBody.menu_item_id as number)
    if (!menuItemDetails) {
      throw new CustomError({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: 'Menu Item Not Found'
      })
    }
    // if quantity is 0 then delete the cart item
    if (requestBody.quantity == 0) {
      await cartRepository.deleteCartItems({
        where: {
          id: cartId
        }
      })
      return cartId
    }
    const updatedCartDetails = await cartRepository.updateCartItems({ id: cartId }, {
      quantity: requestBody.quantity,
      customization: requestBody.customization || null
    })
    return updatedCartDetails.id as number
  } catch (error) {
    return handleError(error)
  }
}


export const cartItemService = {
  createCartItem,
  getCartItemsList,
  getCartDetails,
  updateCartDetails
}