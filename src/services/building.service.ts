import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../constants/common";
import { buildingPublicFields } from "../db/commonSelectQueries";
import { IBuilding } from "../interfaces/building.interface";
import { ICustomError } from "../interfaces/common.interface";
import { buildingRepository } from "../repositories/buildings.repository";
import { CustomError } from "../utils/error";
import { handleError } from "../utils/helperFunctions";
import { restaurantService } from "./restaurants.service";

//TODO- Need to add logic to associate the building with restaurant
const createBuilding = async (requestBody: Partial<IBuilding>): Promise<number | ICustomError> => {
  try {
    if (requestBody.restaurant_id) {
      // checking if restaurant exist or not
      const restaurantDetails = await restaurantService.getRestaurantDetails(requestBody.restaurant_id as number)
      if (!restaurantDetails) {
        throw new CustomError({
          message: 'Restaurant Not Found',
          status: HTTP_STATUS_CODES.NOT_FOUND
        })
      }
    }
    const existingBuilding = await buildingRepository.fetchSingleBuilding({
      select: {
        ...buildingPublicFields
      }
    })
    if (!existingBuilding) {
      throw new CustomError({
        message: 'Building Already exist',
        status: HTTP_STATUS_CODES.ENTITY_ALREADY_EXISTS
      })
    }
    const buildingDetails = {
      name: requestBody.name,
      address: requestBody.address,
      latitude: requestBody.latitude,
      longitude: requestBody.longitude
    }
    const buildingId = await buildingRepository.createBuilding(buildingDetails as Prisma.buildingsCreateArgs['data'])
    return buildingId
  } catch (error) {
    return handleError(error)
  }
}


const getBuildingList = async (): Promise<IBuilding[] | ICustomError> => {
  try {
    const buildingList = await buildingRepository.fetchMultiplebuildings({
      select: {
        ...buildingPublicFields
      }
    })
    return buildingList
  } catch (error) {
    return handleError(error)
  }
}

const getBuildingDetails = async (whereCondtion: object): Promise<IBuilding | ICustomError> => {
  try {
    const buldingDetails = await buildingRepository.fetchSingleBuilding({
      where: {
        ...whereCondtion
      },
      select: {
        ...buildingPublicFields
      }
    })
    return buldingDetails
  } catch (error) {
    return handleError(error)
  }
}

//TODO- Need to add logic to associate the building with restaurant
const updateBuilding = async (id: number, requestBody: Partial<IBuilding>): Promise<number | ICustomError> => {
  try {
    const existingBuilding = await buildingRepository.fetchSingleBuilding({
      where: {
        id
      }
    })
    if (!existingBuilding) {
      throw new CustomError({
        message: 'Building Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    if (requestBody.restaurant_id) {
      // checking if restaurant exist or not
      const restaurantDetails = await restaurantService.getRestaurantDetails(requestBody.restaurant_id as number)
      if (!restaurantDetails) {
        throw new CustomError({
          message: 'Restaurant Not Found',
          status: HTTP_STATUS_CODES.NOT_FOUND
        })
      }
    }
    await buildingRepository.updateSingleBuilding({ id }, requestBody)
    return id
  } catch (error) {
    return handleError(error)
  }
}

const deleteBuilding = async (id: number): Promise<void | ICustomError> => {
  try {
    await buildingRepository.deletebuildings({ where: {
      id
    }})
    return
  } catch (error) {
    return handleError(error)
  }
}


export const buildingService = {
  createBuilding,
  getBuildingList,
  getBuildingDetails,
  updateBuilding,
  deleteBuilding
}