import { Prisma } from "@prisma/client";
import { ICustomError } from "../interfaces/common.interface";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { hashPassword, handleError } from "../utils/helperFunctions";
import { userPublicFields } from "../db/commonSelectQueries";
import { CustomError } from "../utils/error";
import { getDefaultRole } from "./roles.service";
import { HTTP_STATUS_CODES } from "../constants/common";

export async function createUser (requestBody: Partial<IUser>): Promise<number | ICustomError> {
  try {
    const defaultRole = await getDefaultRole().catch((error: any) => { throw error });
    const { full_name, email, phone_number, password } = requestBody;
    const userExistence = await getUserDetails({ email, phone_number });
    if (userExistence) {
      throw new CustomError({
        message: "User will same Email and Mobile Number",
        status: HTTP_STATUS_CODES.ENTITY_ALREADY_EXISTS
      });
    }
    const hashedPassword = await hashPassword(password as string);
    const userObject = {
      full_name,
      email,
      phone_number,
      password: hashedPassword,
      role_id: defaultRole.id
    };
    const createdUserId = await userRepository.createUser(userObject as Prisma.usersCreateArgs['data']).catch(error => { throw error });
    return createdUserId;
  } catch (error) {
    return handleError(error);
  }
}

export async function getUserDetails (whereCondition: object): Promise<IUser | ICustomError> {
  try {
    const userDetails = await userRepository.fetchSingleUser({
      where: { ...whereCondition },
      select: userPublicFields
    });
    return userDetails;
  } catch (error) {
    return handleError(error);
  }
}

export async function getAllUser (): Promise<IUser[] | ICustomError> {
  try {
    return userRepository.fetchMultipleUsers({
      select: userPublicFields
    }).catch((error) => { throw error });
  } catch (error) {
    return handleError(error);
  }
}

export async function updateUser (whereCondtion: object, updatedData: IUser): Promise<IUser | ICustomError> {
  try {
    let existingUserDetails = await userRepository.fetchSingleUser({
      where: { ...whereCondtion }
    });
    if (!existingUserDetails) {
      throw new CustomError({
        message: 'User not found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      });
    }
    existingUserDetails = await userRepository.fetchSingleUser({
      where: {
        email: updatedData.email,
        phone_number: updatedData.phone_number,
        NOT: { id: updatedData.id }
      }
    });
    if (existingUserDetails) {
      throw new CustomError({
        message: 'User with same details already exist',
        status: HTTP_STATUS_CODES.ENTITY_ALREADY_EXISTS
      });
    }
    await userRepository.updateSingleUser({ id: updatedData.id }, updatedData as unknown as Prisma.usersUpdateArgs["data"]).catch((error) => { throw error });
    return updatedData;
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteUser (whereCondtion: object): Promise<void | ICustomError> {
  try {
    return await userRepository.deleteUsers({
      where: { ...whereCondtion }
    } as Prisma.usersDeleteArgs).catch((error) => { throw error });
  } catch (error) {
    return handleError(error);
  }
}

export const userService = {
  createUser,
  getUserDetails,
  getAllUser,
  updateUser,
  deleteUser
};