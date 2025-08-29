import { prisma } from "../db/dbConnection";
import { order_status_enum } from "../interfaces/orders/order.interface";
import { orderRepository } from "../repositories/orders/order.repository";

const defaultOrderStatus = Object.values(order_status_enum);

export const seedDefaultOrderStatus = async () => {
  try {
    const existingStatus = await orderRepository.fetchMultipleOrderStatus({
      where: {
        status: { in: defaultOrderStatus },
      },
      select: {
        status: true,
      },
    });

    const existingOrderStatus = new Set(existingStatus.map(status => status.status));

    const statusToInsert = defaultOrderStatus
      .filter(status => !existingOrderStatus.has(status))
      .map(status => ({ status: status }));

    if (statusToInsert.length > 0) {
      await orderRepository.createMultipleOrderStatus({
        data: statusToInsert,
        skipDuplicates: true,
      });

      console.log(`✅ Inserted order status: ${statusToInsert.map(r => r.status).join(', ')}`);
    } else {
      console.log('⚠️ All order status already exist. No new order status inserted.');
    }
  } catch (error) {
    console.error('❌ Error seeding order status:', error);
  } finally {
    await prisma.$disconnect();
  }
};
