import { Prisma } from "@prisma/client";
import { prisma } from "../../db/dbConnection";
import { IOrder, IOrderItems } from "../../interfaces/orders/order.interface";

const createOrder = async (data: Prisma.ordersCreateArgs['data']): Promise<{id: number, order_number: string}> => {
  try {
    const createdOrder = await prisma.orders.create({ data: data });
    return {id: createdOrder.id, order_number: createdOrder.order_number}
  } catch (error) {
    throw error;
  }
};

const fetchMultipleOrders = async (whereCondition: Prisma.ordersFindManyArgs): Promise<IOrder[]> => {
  try {
    const orderList = await prisma.orders.findMany(whereCondition);
    return orderList as unknown as IOrder[];
  } catch (error) {
    throw error;
  }
};

const fetchSingleOrder = async (whereCondition: Prisma.ordersFindFirstArgs): Promise<IOrder> => {
  try {
    const orderDetails = await prisma.orders.findFirst(whereCondition);
    return orderDetails as unknown as IOrder;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const updateMultipleOrders = async (
  whereCondition: Prisma.ordersWhereInput,
  updatedData: Prisma.ordersUpdateManyArgs['data']
): Promise<number> => {
  try {
    const updatedResult = await prisma.orders.updateMany({
      where: { ...whereCondition },
      data: updatedData,
    });
    return updatedResult.count;
  } catch (error) {
    throw error;
  }
};

const updateSingleOrder = async (
  whereCondition: Prisma.ordersWhereUniqueInput,
  updatedData: Prisma.ordersUpdateArgs['data']
): Promise<IOrder> => {
  try {
    const updatedResult = await prisma.orders.update({
      where: whereCondition,
      data: updatedData,
    });
    return updatedResult as unknown as IOrder;
  } catch (error) {
    throw error;
  }
};

const deleteOrder = async (whereCondition: Prisma.ordersDeleteArgs): Promise<void> => {
  try {
    await prisma.orders.delete(whereCondition);
  } catch (error) {
    throw error;
  }
}

const createOrderItems = async (data: Prisma.order_itemsCreateArgs['data']): Promise<number> => {
  try {
    const createdItem = await prisma.order_items.create({ data })
    return createdItem.id
  } catch (error) {
    throw error
  }
}

const updateOrderItems = async (whereCondtion: Prisma.order_itemsWhereUniqueInput, data: Prisma.order_itemsUpdateArgs['data']): Promise<number> => {
  try {
    const updatedResult = await prisma.order_items.update({
      where: whereCondtion,
      data
    })
    return updatedResult.id
  } catch (error) {
    throw error
  }
}


const fetchOrderItemDetails = async (whereCondition: Prisma.order_itemsFindFirstArgs): Promise<IOrderItems> => {
  try {
    const orderDetails = await prisma.order_items.findFirst(whereCondition);
    return orderDetails as IOrderItems
  } catch (error) {
    throw error;
  }
};


const fetchMultipleOrderStatus = async (whereCondtion: Prisma.order_statusFindManyArgs) => {
  try {
    return await prisma.order_status.findMany(whereCondtion)
  } catch (error) {
    throw error
  }
}

const createMultipleOrderStatus = async (data: Prisma.order_statusCreateManyArgs) => {
  try {
    await prisma.order_status.createMany(data)
  } catch (error) {
    throw error
  }
}

const fetchOrderStatus = async (whereCondtion: Prisma.order_statusFindFirstArgs) => {
  try {
    return await prisma.order_status.findFirst(whereCondtion)
  } catch (error) {
    throw error
  }
}



export const orderRepository = {
  createOrder,
  fetchMultipleOrders,
  fetchSingleOrder,
  deleteOrder,
  updateMultipleOrders,
  updateSingleOrder,
  createOrderItems,
  updateOrderItems,
  fetchOrderItemDetails,
  fetchMultipleOrderStatus,
  createMultipleOrderStatus,
  fetchOrderStatus
};
