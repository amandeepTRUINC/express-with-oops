import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../constants/common";
import { buildingPublicFields } from "../db/commonSelectQueries";
import { IBuilding, IBuildingRestaurantPayload } from "../interfaces/building.interface";
import { ICustomError } from "../interfaces/common.interface";
import { buildingRepository } from "../repositories/buildings.repository";
import { CustomError } from "../utils/error";
import { handleError } from "../utils/helperFunctions";
import { restaurantService } from "./restaurants.service";
import { prisma } from "../db/dbConnection";

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
    if (requestBody.restaurant_id) {
      await associateBuildingWithRestaurant({
        restaurant_id: requestBody.restaurant_id,
        building_id: buildingId
      })
    }
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
    if (requestBody.restaurant_id) {

    }
    return id
  } catch (error) {
    return handleError(error)
  }
}

const deleteBuilding = async (id: number): Promise<void | ICustomError> => {
  try {
    const details = await buildingRepository.fetchSingleBuilding({
      where: {
        id
      }
    })
    if (details && details.restaurant_id) {
      await Promise.all([
        deLocateBuidlingWithRestaurant({ restaurant_id: details.restaurant_id, building_id: details.id as number }),
        buildingRepository.deletebuildings({
          where: {
            id
          }
        })
      ])
    }
    return
  } catch (error) {
    return handleError(error)
  }
}

const associateBuildingWithRestaurant = async (payload: IBuildingRestaurantPayload): Promise<void | ICustomError> => {
  try {
    // checking if restaurant exist or not
    if (payload.restaurant_id) {
      const restaurantDetails = await restaurantService.getRestaurantDetails(payload.restaurant_id as number)
      if (!restaurantDetails) {
        throw new CustomError({
          message: 'Restaurant Not Found',
          status: HTTP_STATUS_CODES.NOT_FOUND
        })
      }
    }
    // checking if building exist or not
    if (payload.building_id) {
      const existingBuilding = await buildingRepository.fetchSingleBuilding({
        where: {
          id: payload.building_id
        }
      })
      if (!existingBuilding) {
        throw new CustomError({
          message: 'Building Not Found',
          status: HTTP_STATUS_CODES.NOT_FOUND
        })
      }
    }
    const data = {
      ...(payload.id && { id: payload.id }),
      building_id: payload.building_id,
      restaurant_id: payload.restaurant_id
    }
    if (!payload.id) {
      await buildingRepository.updateSingleBuildingRestaurantAssociatation({ id: payload.id }, data)
      return
    }
    await buildingRepository.createBuildingRestaurantAssociatation(data)
    return
  } catch (error) {
    return handleError(error)
  }
}

const deLocateBuidlingWithRestaurant = async (payload: IBuildingRestaurantPayload): Promise<void | ICustomError> => {
  try {
    const details = await buildingRepository.fetchSingleBuildingRestaurantAssociatation({
      where: {
        building_id: payload.building_id,
        restaurant_id: payload.restaurant_id
      }
    })
    if (details) {
      await buildingRepository.deleteSingleBuildingRestaurantAssociatation({
        id: details.id
      })
    }
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
  deleteBuilding,
  associateBuildingWithRestaurant,
  deLocateBuidlingWithRestaurant
}