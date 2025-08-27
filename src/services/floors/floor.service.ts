import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../../constants/common";
import { ICustomError } from "../../interfaces/shared/common.interface";
import { IFloor } from "../../interfaces/floors/floor.interface";
import { floorRepository } from "../../repositories/floors/floor.repository";
import { CustomError } from "../../utils/error";
import { handleError } from "../../utils/helperFunctions";
import { buildingService } from "../buildings/building.service";

const createFloor = async (requestBody: IFloor): Promise<number | ICustomError> => {
  try {
    const buildingExistence = await buildingService.getBuildingDetails({ id: requestBody.building_id })
    if (!buildingExistence) {
      throw new CustomError({
        message: 'Building Not found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    // checking if floor is already added or not
    const existingFloor = await floorRepository.fetchSingleFloor({
      where: {
        building_id: requestBody.building_id,
        floor_number: requestBody.floor_number
      }
    })
    if (existingFloor) {
      throw new CustomError({
        message: 'Floor Already exist',
        status: HTTP_STATUS_CODES.ENTITY_ALREADY_EXISTS
      })
    }
    const floorDetails = {
      building_id: requestBody.building_id,
      identifier: requestBody.identifier,
      floor_number: requestBody.floor_number,
      company_name: requestBody.company_name,
    }

    const newFloorId = await floorRepository.createFloor(floorDetails)
    return newFloorId
  } catch (error) {
    return handleError(error)
  }
}

const getFloorList = async (whereCondtion: Prisma.floorsFindManyArgs): Promise<IFloor[] | ICustomError> => {
  try {
    const floorList = await floorRepository.fetchMultipleFloors(whereCondtion)
    return floorList
  } catch (error) {
    return handleError(error)
  }
}

const getFloorDetails = async (floorId: number): Promise<IFloor | ICustomError> => {
  try {
    const floorDetails = await floorRepository.fetchSingleFloor({
      where: {
        id: floorId
      }
    })
    return floorDetails
  } catch (error) {
    return handleError(error)
  }
}


const updateFloor = async (floorId: number, requestBody: IFloor): Promise<number | ICustomError> => {
  try {
    // checking if building exist or not
    const buildingExistence = await buildingService.getBuildingDetails({ id: requestBody.building_id })
    if (!buildingExistence) {
      throw new CustomError({
        message: 'Building Not found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    // checking if floor is already added or not
    const existingFloor = await floorRepository.fetchSingleFloor({
      where: {
        id: floorId
      }
    })
    if (!existingFloor) {
      throw new CustomError({
        message: 'Floor Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    const updatedDetials = {
      identifier: requestBody.identifier,
      floor_number: requestBody.floor_number,
      company_name: requestBody.company_name,
    }
    await floorRepository.updateSingleFloor({
      id: floorId
    }, updatedDetials)
    return floorId
  } catch (error) {
    return handleError(error)
  }
}

const deleteFloor = async (floorId: number): Promise<void | ICustomError> => {
  try {
    const floorExistence = await floorRepository.fetchSingleFloor({
      where: {
        id: floorId
      }
    })
    if (!floorExistence) {
      throw new CustomError({
        message: 'Floor Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    await floorRepository.deleteFloors({
      where: {
        id: floorId
      }
    })
    return
  } catch (error) {
    return handleError(error)
  }
}


export const floorService = {
  createFloor,
  getFloorList,
  getFloorDetails,
  updateFloor,
  deleteFloor
}