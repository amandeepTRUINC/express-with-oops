import { Prisma } from "@prisma/client";
import { IUser } from "../interfaces/user.interface";
import { prisma } from "../db/dbConnection";

const createUser = async (userDetails: Prisma.usersCreateArgs['data']): Promise<number> => {
  try {
    const createdUser = await prisma.users.create({ data: userDetails });
    return createdUser.id;
  } catch (error) {
    throw error;
  }
};

const fetchMultipleUsers = async (whereCondition: Prisma.usersFindManyArgs): Promise<IUser[]> => {
  try {
    const usersList = await prisma.users.findMany(whereCondition);
    return usersList as IUser[];
  } catch (error) {
    throw error;
  }
};

const fetchSingleUser = async (whereCondition: Prisma.usersFindFirstArgs): Promise<IUser> => {
  try {
    const userDetails = await prisma.users.findFirst(whereCondition);
    return userDetails as IUser;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const updateMultipleUsers = async (
  whereCondition: Prisma.usersWhereInput,
  updatedData: Prisma.usersUpdateManyArgs['data']
): Promise<number> => {
  try {
    const updatedResult = await prisma.users.updateMany({
      where: { ...whereCondition },
      data: updatedData,
    });
    return updatedResult.count;
  } catch (error) {
    throw error;
  }
};

const updateSingleUser = async (
  whereCondition: Prisma.usersWhereUniqueInput,
  updatedData: Prisma.usersUpdateArgs['data']
): Promise<IUser> => {
  try {
    const updatedResult = await prisma.users.update({
      where: whereCondition,
      data: updatedData,
    });
    return updatedResult as IUser;
  } catch (error) {
    throw error;
  }
};

const deleteUsers = async (whereCondition: Prisma.usersDeleteArgs): Promise<void> => {
  try {
    await prisma.users.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const userRepository = {
  createUser,
  fetchMultipleUsers,
  fetchSingleUser,
  updateMultipleUsers,
  updateSingleUser,
  deleteUsers,
};
