import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../../constants/common";
import { IMenuItem } from "../../interfaces/menuItems/menuItem.interface";
import { IOrder, IOrderItems, order_status_enum } from "../../interfaces/orders/order.interface";
import { IRestaurant } from "../../interfaces/restaurants/restaurants.interface";
import { ICustomError } from "../../interfaces/shared/common.interface";
import { orderRepository } from "../../repositories/orders/order.repository";
import { CustomError } from "../../utils/error";
import { handleError } from "../../utils/helperFunctions";
import { menuItemService } from "../menuItems/menuItem.service";
import { restaurantService } from "../restaurants/restaurants.service";
import { orderDetailsPublicFields } from "../../db/commonSelectQueries";

const createOrder = async (reqBody: IOrder): Promise<{ id: number, order_number: string } | ICustomError> => {
  try {
    // checking if restaurant exists or not
    const restaurantDetails = await restaurantService.getRestaurantDetails(reqBody.restaurant_id) as IRestaurant
    if (!restaurantDetails) {
      throw new CustomError({
        message: "Restaurant Not Found",
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    const orderItems: Partial<IOrderItems>[] = []
    await Promise.allSettled(reqBody.items.map(async (item) => {
      // checking if menu item exists or not
      const menuItemDetails = await menuItemService.getMenuItemDetails(item.menu_item_id) as IMenuItem
      if (!menuItemDetails) {
        throw new CustomError({
          message: `Menu Item with id ${item.menu_item_id} Not Found`,
          status: HTTP_STATUS_CODES.NOT_FOUND
        })
      }
      // checking if menu item belongs to the same restaurant or not
      else if (menuItemDetails.restaurant_id !== reqBody.restaurant_id) {
        throw new CustomError({
          message: `Menu Item with id ${item.menu_item_id} does not belong to the restaurant with id ${reqBody.restaurant_id}`,
          status: HTTP_STATUS_CODES.BAD_REQUEST
        })
      }
      else if (item.quantity <= 0) {
        throw new CustomError({
          message: `Quantity for menu item should be greater than zero`,
          status: HTTP_STATUS_CODES.BAD_REQUEST
        })
      } else {
        orderItems.push({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: menuItemDetails.price,
          total_price: menuItemDetails.price * item.quantity,
          customizations: item.customizations || ""
        })
      }
    }))
    // chcking loyality points  TODO- NEED to Implement this Loyality points logic
    if (reqBody.loyalty_discount) {

    }
    const totalOrderAmount = (orderItems.reduce((acc, curr) => acc + (curr.total_price ?? 0), 0) - (reqBody.loyalty_discount ?? 0))
    const commisionAmount = restaurantDetails.commission_rate ? (totalOrderAmount * restaurantDetails.commission_rate) / 100 : (totalOrderAmount * parseInt(process.env.DEFAULT_COMMISION_RATE as string)) / 100
    // const defaultStatus = // TODO - Need to add Pricing implementation of loaylity points and offers.

    const defaultOrderStatus = await orderRepository.fetchOrderStatus({
      where: {
        status: order_status_enum.PENDING
      }
    })
    const orderDetails = {
      user_id: reqBody.user_id,
      restaurant_id: reqBody.restaurant_id,
      order_status: defaultOrderStatus?.id,
      order_type: reqBody.order_type,
      subtotal_amount: totalOrderAmount,
      commission_amount: commisionAmount,
      loyalty_discount: reqBody.loyalty_discount,
      total_amount: totalOrderAmount,
      restaurant_amount: totalOrderAmount - commisionAmount,
      delivery_address: reqBody.delivery_address,
      estimated_time: reqBody.estimated_time,
      special_instructions: reqBody.special_instructions || null
    }
    const orderId = await orderRepository.createOrder(orderDetails as unknown as Prisma.ordersCreateArgs['data'])
    await Promise.allSettled(orderItems.map(async (item) => {
      await orderRepository.createOrderItems({
        order_id: orderId,
        menu_item_id: item.menu_item_id as number,
        quantity: item.quantity as number,
        unit_price: item.unit_price as number,
        total_price: item.total_price as number,
        customizations: item.customizations || ""
      } as unknown as Prisma.order_itemsCreateArgs['data'])
    }))
    return { id: orderId.id, order_number: orderId.order_number }
  } catch (error) {
    return handleError(error)
  }
}

const getOrderList = async (whereCondition: Prisma.ordersFindManyArgs): Promise<IOrder[] | ICustomError> => {
  try {
    const orderList = await orderRepository.fetchMultipleOrders(whereCondition)
    return orderList
  } catch (error) {
    return handleError(error)
  }
}

const getOrderDetails = async (orderId: number, userId?: number): Promise<IOrder | ICustomError> => {
  try {
    const orderDetails = await orderRepository.fetchSingleOrder({
      where: {
        id: orderId,
        user_id: userId
      },
      select: {
        ...orderDetailsPublicFields
      }
    })
    return orderDetails
  } catch (error) {
    return handleError(error)
  }
}

const deleteOrder = async (orderId: number): Promise<void | ICustomError> => {
  try {
    const orderDetails = await orderRepository.fetchSingleOrder({
      where: {
        id: orderId
      }
    })
    if (orderDetails) {
      await orderRepository.deleteOrder({
        where: {
          id: orderId
        }
      })
    }
  } catch (error) {
    return handleError(error)
  }
}

const updateOrderStatus = async (orderId: number, status: order_status_enum): Promise<number | ICustomError> => {
  try {

    const orderDetails = await orderRepository.fetchSingleOrder({
      where: {
        id: orderId
      }
    })
    if (!orderDetails) {
      throw new CustomError({
        message: "Order Not Found",
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    const statusDetails = await orderRepository.fetchOrderStatus({
      where: {
        status: status,
      }
    })
    await orderRepository.updateSingleOrder({
      id: orderId
    }, {
      order_status: {
        connect: { id: statusDetails?.id as number }
      }
    })
    return orderId
  } catch (error) {
    return handleError(error)
  }
}

export const orderService = {
  createOrder,
  getOrderList,
  getOrderDetails,
  deleteOrder,
  updateOrderStatus
}