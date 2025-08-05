import { HTTP_STATUS_CODES } from "../constants/common";
import { prisma } from "../db/dbConnection";
import { IRoles } from "../interfaces/roles.interface";
import { CustomError } from "../utils/error";

export const getDefaultRole = async (): Promise<IRoles> => {
  try {
    const role = await prisma.roles.findFirst({
      where: { name: 'customer' },
    });

    if (!role) {
      throw new CustomError({
        message: 'No Default Role Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      });
    }
    return role;
  } catch (error: unknown) {
    throw error;
  }
}

export default {
  getDefaultRole: getDefaultRole
}