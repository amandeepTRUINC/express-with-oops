import { Prisma } from "@prisma/client";
import { HTTP_STATUS_CODES } from "../../constants/common";
import { ICustomError } from "../../interfaces/shared/common.interface";
import { enum_restaurant_approval_status, IRestaurant } from "../../interfaces/restaurants/restaurants.interface";
import { roles_enum } from "../../interfaces/roles/roles.interface";
import { IUser } from "../../interfaces/users/user.interface";
import { restaurantRepository } from "../../repositories/restaurants/restaurants.repository";
import { CustomError } from "../../utils/error";
import { handleError } from "../../utils/helperFunctions";
import { getRoleDetails } from "../roles/roles.service";
import { userService } from "../users/user.service";
import { restaurantPubliFields } from "../../db/commonSelectQueries";


const createRestaurant = async (
  requestBody: Partial<IRestaurant>
): Promise<number | ICustomError> => {
  try {
    const roleDetails = await getRoleDetails(roles_enum.RESTAURANT_OWNER)
    let ownerId: number;
    // checking if restaurant_owner exist or not
    let ownerExistence = await userService.getUserDetails({ email: requestBody.owner_info?.email, role_id: roleDetails.id, phone_number: requestBody.owner_info?.phone_number })
    if (!ownerExistence) {
      // it means we have to create a owner first and then associate the owner with restaurant
      const ownerDetails = {
        ...requestBody.owner_info,
        password: process.env.DEFAULT_OWNER_PASSWORD as string,
        role_id: roleDetails.id
      }
      ownerId = await userService.createUser(ownerDetails) as number

    } else {
      ownerId = (ownerExistence as IUser).id
    }

    // duplicacy check in case same owner is trying to register duplicate restaurant. // TODO- NEED TO CHECK IN FUTURE IN CASE ONE OWNER WANT TO OPEN THE SAME RESTAURANT AT DIFFERENT LOCATION (FOR EXAMPLE - IN MOHALI 67, 74, 75, 82 AND SO ON.). SO IN THIS CASE WE HAVE TO VERIFY WITH THE ADDRESS AS WELL

    const restaurant_existence = await restaurantRepository.fetchSingleRestaurant({
      where: {
        name: requestBody.name,
        contact_number: requestBody.contact_number,
        owner_id: ownerId
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
      owner_id: ownerId,
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

const getRestaurantList = async (): Promise<IRestaurant[] | ICustomError> => {
  try {
    const restaurantList = await restaurantRepository.fetchMultipleRestaurants({select: {
      ...restaurantPubliFields
    }})
    return restaurantList
  } catch (error) {
    return handleError(error)
  }
}

const getRestaurantDetails = async (restaurantId: number): Promise<IRestaurant | ICustomError> => {
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

const updateRestaurantDetails = async (requestBody: Partial<IRestaurant> & { owner_id: number }): Promise<number | ICustomError> => {
  try {
    const roleDetails = await getRoleDetails(roles_enum.RESTAURANT_OWNER)
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

const updaterestaurantStatus = async (id: number, status: string): Promise<void | ICustomError> => {
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

export const restaurantService = {
  createRestaurant,
  getRestaurantDetails,
  getRestaurantList,
  updateRestaurantDetails,
  updaterestaurantStatus
}