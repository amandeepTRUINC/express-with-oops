import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../constants/common";
import { prisma } from "../db/dbConnection";
import { IRoles } from "../interfaces/roles.interface";
import { CustomError } from "../utils/error";

const getDefaultRole = async (): Promise<IRoles> => {
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

const fetchSingleData = async (whereCondtion: Prisma.rolesFindFirstArgs) => {
  try {
    const role = await prisma.roles.findFirst(whereCondtion)
    return role
  } catch (error) {
    throw error
  }
}


const fetchMultipleData = async (whereCondtion: Prisma.rolesFindManyArgs) => {
  try {
    const roles = await prisma.roles.findMany(whereCondtion)
    return roles
  } catch (error) {
    throw error
  }
}

const insertMany = async (data: Prisma.rolesCreateManyArgs) => {
  try {
    await prisma.roles.createMany(data)
  } catch (error) {
    throw error
  }
}

export default {
  getDefaultRole,
  fetchMultipleData,
  insertMany,
  fetchSingleData
}