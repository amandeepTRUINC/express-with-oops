import { Prisma } from "@prisma/client";
import { prisma } from "../../db/dbConnection";
import { IFloor } from "../../interfaces/floors/floor.interface";

const createFloor = async (floorDetails: Prisma.floorsCreateArgs['data']): Promise<number> => {
  try {
    const createFloor = await prisma.floors.create({ data: floorDetails });
    return createFloor.id;
  } catch (error) {
    throw error;
  }
};

const fetchMultipleFloors = async (whereCondition: Prisma.floorsFindManyArgs): Promise<IFloor[]> => {
  try {
    const floorList = await prisma.floors.findMany(whereCondition);
    return floorList as IFloor[];
  } catch (error) {
    throw error;
  }
};

const fetchSingleFloor = async (whereCondition: Prisma.floorsFindFirstArgs): Promise<IFloor> => {
  try {
    const floorDetails = await prisma.floors.findFirst(whereCondition);
    return floorDetails as IFloor;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const updateMultipleFloors = async (
  whereCondition: Prisma.floorsWhereInput,
  updatedData: Prisma.floorsUpdateManyArgs['data']
): Promise<number> => {
  try {
    const updatedResult = await prisma.floors.updateMany({
      where: { ...whereCondition },
      data: updatedData,
    });
    return updatedResult.count;
  } catch (error) {
    throw error;
  }
};

const updateSingleFloor = async (
  whereCondition: Prisma.floorsWhereUniqueInput,
  updatedData: Prisma.floorsUpdateArgs['data']
): Promise<IFloor> => {
  try {
    const updatedResult = await prisma.floors.update({
      where: whereCondition,
      data: updatedData,
    });
    return updatedResult as IFloor;
  } catch (error) {
    throw error;
  }
};

const deleteFloors = async (whereCondition: Prisma.usersDeleteArgs): Promise<void> => {
  try {
    await prisma.users.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const floorRepository = {
  createFloor,
  fetchMultipleFloors,
  fetchSingleFloor,
  updateMultipleFloors,
  updateSingleFloor,
  deleteFloors,
};
