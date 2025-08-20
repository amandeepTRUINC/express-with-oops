import { Prisma } from "@prisma/client";
import { prisma } from "../db/dbConnection";
import { IBuilding } from "../interfaces/building.interface";

const createBuilding = async (buildingDetails: Prisma.buildingsCreateArgs['data']): Promise<number> => {
  try {
    const createdUser = await prisma.buildings.create({ data: buildingDetails });
    return createdUser.id;
  } catch (error) {
    throw error;
  }
};

const fetchMultiplebuildings = async (whereCondition: Prisma.buildingsFindManyArgs): Promise<IBuilding[]> => {
  try {
    const buildingsList = await prisma.buildings.findMany(whereCondition);
    return buildingsList as IBuilding[];
  } catch (error) {
    throw error;
  }
};

const fetchSingleBuilding = async (whereCondition: Prisma.buildingsFindFirstArgs): Promise<IBuilding> => {
  try {
    const buildingDetails = await prisma.buildings.findFirst(whereCondition);
    return buildingDetails as IBuilding;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const updateMultiplebuildings = async (
  whereCondition: Prisma.buildingsWhereInput,
  updatedData: Prisma.buildingsUpdateManyArgs['data']
): Promise<number> => {
  try {
    const updatedResult = await prisma.buildings.updateMany({
      where: { ...whereCondition },
      data: updatedData,
    });
    return updatedResult.count;
  } catch (error) {
    throw error;
  }
};

const updateSingleBuilding = async (
  whereCondition: Prisma.buildingsWhereUniqueInput,
  updatedData: Prisma.buildingsUpdateArgs['data']
): Promise<IBuilding> => {
  try {
    const updatedResult = await prisma.buildings.update({
      where: whereCondition,
      data: updatedData,
    });
    return updatedResult as IBuilding;
  } catch (error) {
    throw error;
  }
};

const deletebuildings = async (whereCondition: Prisma.buildingsDeleteArgs): Promise<void> => {
  try {
    await prisma.buildings.delete(whereCondition);
  } catch (error) {
    throw error;
  }
};

export const buildingRepository = {
  createBuilding,
  fetchMultiplebuildings,
  fetchSingleBuilding,
  updateMultiplebuildings,
  updateSingleBuilding,
  deletebuildings,
};
