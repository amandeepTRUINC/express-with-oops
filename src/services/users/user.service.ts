import { Prisma } from "@prisma/client";
import { ICustomError } from "../../interfaces/shared/common.interface";
import { IUser } from "../../interfaces/users/user.interface";
import { userRepository } from "../../repositories/users/user.repository";
import { hashPassword, handleError, isEmail } from "../../utils/helperFunctions";
import { userPublicFields } from "../../db/commonSelectQueries";
import { CustomError } from "../../utils/error";
import { getDefaultRole, getRoleDetails } from "../roles/roles.service";
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "../../constants/common";

async function createUser (requestBody: Partial<IUser>): Promise<number | ICustomError> {
  try {
    const defaultRole = await getDefaultRole().catch((error: any) => { throw error });
    const { full_name, email, phone_number, password } = requestBody;
    const userExistence = await getUserDetails({ email, phone_number });
    if (userExistence) {
      throw new CustomError({
        message: "User with same Email and Mobile Number Already Exists",
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

async function getUserDetails (whereCondition: object): Promise<IUser | ICustomError> {
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

async function getAllUser (): Promise<IUser[] | ICustomError> {
  try {
    return userRepository.fetchMultipleUsers({
      select: userPublicFields
    }).catch((error) => { throw error });
  } catch (error) {
    return handleError(error);
  }
}

async function updateUser (whereCondtion: object, updatedData: IUser): Promise<IUser | ICustomError> {
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

async function deleteUser (whereCondtion: object): Promise<void | ICustomError> {
  try {
    return await userRepository.deleteUsers({
      where: { ...whereCondtion }
    } as Prisma.usersDeleteArgs).catch((error) => { throw error });
  } catch (error) {
    return handleError(error);
  }
}

async function updateUserRole (userId: number, role: string): Promise<void | ICustomError> {
  try {
    const userDetails = await userRepository.fetchSingleUser({
      where: { id: userId }
    })
    if (!userDetails) {
      throw new CustomError({
        message: 'User not found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }

    const roleDetails = await getRoleDetails(role)
    if (!roleDetails) {
      throw new CustomError({
        message: 'Role not Found',
        status: HTTP_STATUS_CODES.NOT_FOUND
      })
    }

    await userRepository.updateSingleUser({ id: userId}, { role_id: roleDetails.id })
    return
  } catch (error) {
    return handleError(error)
  }
}

async function searchUser(searchParam: string): Promise<IUser | ICustomError> {
  try {
    const userDetails = await userRepository.fetchSingleUser({
      where: isEmail(searchParam)
        ? { email: { contains: searchParam, mode: "insensitive" } }
        : { full_name: { contains: searchParam, mode: "insensitive" } },
    });

    if (!userDetails) {
      throw new CustomError({
        message: HTTP_STATUS_MESSAGES.NOT_FOUND,
        status: HTTP_STATUS_CODES.NOT_FOUND,
      });
    }

    return userDetails;
  } catch (error) {
    return handleError(error);
  }
}
export const userService = {
  createUser,
  getUserDetails,
  getAllUser,
  updateUser,
  deleteUser,
  updateUserRole,
  searchUser
};