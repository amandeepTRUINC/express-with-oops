import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../constants/common";
import { prisma } from "../db/dbConnection";
import { ICustomError } from "../interfaces/common.interface";
import { enum_restaurant_approval_status, IRestaurant } from "../interfaces/restaurants.interface";
import { roles_enum } from "../interfaces/roles.interface";
import { IUser } from "../interfaces/user.interface";
import { restaurantRepository } from "../repositories/restaurants.repository";
import { CustomError } from "../utils/error";
import { handleError } from "../utils/helperFunctions";
import { getRoleDetails } from "./roles.service";
import { userService } from "./user.service";
import { restaurantPubliFields } from "../db/commonSelectQueries";


export const createRestaurant = async (
  requestBody: Partial<IRestaurant>
): Promise<number | ICustomError> => {
  try {
    const roleDetails = await getRoleDetails(roles_enum.RESTRAUNT_OWNER)
    // checking if restaurant_owner exist or not
    const ownerExistence = await userService.getUserDetails({ id: requestBody.owner_id, role_id: roleDetails.id })
    if (!ownerExistence) {
      throw new CustomError({
        message: 'Owner Details not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    // duplicacy check in case same owner is trying to register duplicate restaurant. // TODO- NEED TO CHECK IN FUTURE IN CASE ONE OWNER WANT TO OPEN THE SAME RESTAURANT AT DIFFERENT LOCATION (FOR EXAMPLE - IN MOHALI 67, 74, 75, 82 AND SO ON.). SO IN THIS CASE WE HAVE TO VERIFY WITH THE ADDRESS AS WELL

    const restaurant_existence = await restaurantRepository.fetchSingleRestaurant({
      where: {
        name: requestBody.name,
        contact_number: requestBody.contact_number,
        owner_id: (ownerExistence as IUser).id
      }
    })
    if (restaurant_existence) {
      throw new CustomError({
        message: 'Same Restaurant Already Exist',
        status: HTTP_STATUS_CODES.ENTITY_ALREADY_EXISTS
      })
    }
    const restaurantDetails = {
      name: requestBody.name,
      address: requestBody.address,
      contact_number: requestBody.contact_number,
      owner_id: (ownerExistence as IUser).id,
      approval_status: enum_restaurant_approval_status.PENDING
    }
    const createdId = await restaurantRepository.createRestaurant(restaurantDetails as Prisma.restaurantsCreateArgs['data']).catch((error) => {
      throw error
    })
    return createdId
  } catch (error) {
    return handleError(error);
  }
};

export const getRestaurantList = async (): Promise<IRestaurant[] | ICustomError> => {
  try {
    const restaurantList = await restaurantRepository.fetchMultipleRestaurants({})
    return restaurantList
  } catch (error) {
    return handleError(error)
  }
}

export const getRestaurantDetails = async (restaurantId: number): Promise<IRestaurant | ICustomError> => {
  try {
    const restaurantDetails = await restaurantRepository.fetchSingleRestaurant({
      where: {
        id: restaurantId
      },
      select: {
        ...restaurantPubliFields
      }
    })
    return restaurantDetails
  } catch (error) {
    return handleError(error)
  }
}

export const updateRestaurantDetails = async (requestBody: Partial<IRestaurant>): Promise<number | ICustomError> => {
  try {
    const roleDetails = await getRoleDetails(roles_enum.RESTRAUNT_OWNER)
    // checking if restaurant_owner exist or not
    const ownerExistence = await userService.getUserDetails({ id: requestBody.owner_id, role_id: roleDetails.id })
    if (!ownerExistence) {
      throw new CustomError({
        message: 'Owner Details not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    // checking if restaurant exist or not
    const restaurant_existence = await restaurantRepository.fetchSingleRestaurant({
      where: {
        id: requestBody.id,
        owner_id: (ownerExistence as IUser).id,
        is_active: true
      }
    })
    if (!restaurant_existence) {
      throw new CustomError({
        message: 'Restaurant Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    const detailsToUpdate: Partial<IRestaurant> = {
      name: requestBody.name,
      address: requestBody.address,
      contact_number: requestBody.contact_number,
    }
    await restaurantRepository.updateSingleRestaurant({ id: requestBody.id }, detailsToUpdate)
    return requestBody.id as number
  } catch (error) {
    return handleError(error)
  }
}

export const updaterestaurantStatus = async (id: number, status: string): Promise<void | ICustomError> => {
  try {
    // checking if restaurant exist
    const restaurant_existence = await restaurantRepository.fetchSingleRestaurant({
      where: {
        id: id,
        is_active: true
      }
    })
    if (!restaurant_existence) {
      throw new CustomError({
        message: 'Restaurant Not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }
    await restaurantRepository.updateSingleRestaurant({ id }, { approval_status: status })
    return 
  } catch (error) {
    return handleError(error)
  }
}