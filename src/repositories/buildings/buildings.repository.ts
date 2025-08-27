import { Prisma } from "@prisma/client";
import { prisma } from "../../db/dbConnection";
import { IBuilding, IBuildingRestaurantPayload } from "../../interfaces/buildings/building.interface";

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

const createBuildingRestaurantAssociatation = async (data: Prisma.restaurant_buildingsCreateArgs['data']): Promise<number> => {
  try {
    const result = await prisma.restaurant_buildings.create({
      data
    })
    return result.id
  } catch (error) {
    throw error
  }
}

const fetchSingleBuildingRestaurantAssociatation = async (whereCondition: Prisma.restaurant_buildingsFindFirstArgs): Promise<IBuildingRestaurantPayload> => {
  try {
    const details = await prisma.restaurant_buildings.findFirst(whereCondition)
    return details as IBuildingRestaurantPayload
  } catch (error) {
    throw error
  }
}

const fetchMultipleBuildingRestaurantAssociatation = async (whereCondition: Prisma.restaurant_buildingsWhereInput): Promise<IBuildingRestaurantPayload[]> => {
  try {
    const list = await prisma.restaurant_buildings.findMany({
      where: {
        ...whereCondition
      }
    })
    return list
  } catch (error) {
    throw error
  }
}

const updateSingleBuildingRestaurantAssociatation = async (whereCondition: Prisma.restaurant_buildingsWhereUniqueInput,
  updatedData: Prisma.buildingsUpdateArgs['data']): Promise<number> => {
  try {
    const details = await prisma.restaurant_buildings.update({
      where: whereCondition,
      data: updatedData
    })
    return details.id
  } catch (error) {
    throw error
  }
}

const deleteSingleBuildingRestaurantAssociatation = async (whereCondition: Prisma.restaurant_buildingsWhereUniqueInput): Promise<void> => {
  try {
    await prisma.restaurant_buildings.delete({
      where: whereCondition
    })
  } catch (error) {
    throw error
  }
}


export const buildingRepository = {
  createBuilding,
  fetchMultiplebuildings,
  fetchSingleBuilding,
  updateMultiplebuildings,
  updateSingleBuilding,
  deletebuildings,
  createBuildingRestaurantAssociatation,
  fetchSingleBuildingRestaurantAssociatation,
  fetchMultipleBuildingRestaurantAssociatation,
  updateSingleBuildingRestaurantAssociatation,
  deleteSingleBuildingRestaurantAssociatation
};
