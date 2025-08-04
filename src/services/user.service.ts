import { Prisma } from "@prisma/client";
import { ICustomError, IHelperFunctions } from "../common/interfaces/common.interface";
import { IUser, IUserRepository, IUserService } from "../common/interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { helperFunctions } from "../utils/helperFunctions";
import { userPublicFields } from "../db/commonSelectQueries";
import { IRolesService } from "../common/interfaces/roles.interface";
import { CustomError } from "../utils/error";
import rolesService from "./roles.service";

class UserService implements IUserService {

  constructor(
    private userRepository: IUserRepository,
    private helperFunctions: IHelperFunctions,
    private rolesService: IRolesService
  ) { }

  async createUser (requestBody: Partial<IUser>): Promise<number | ICustomError> {
    try {
      const defaultRole = await this.rolesService.getDefaultRole().catch((error) => {
        throw error
      })
      // checking if user with combination of email/mobile_number
      const {
        full_name,
        email,
        phone_number,
        password
      } = requestBody
      const userExistence = await this.getUserDetails({ email, phone_number })
      if (userExistence) {
        throw new CustomError({
          message: "User will same Email and Mobile Number",
          status: 409
        })
      }
      const hashedPassword = await this.helperFunctions.hashPassword(password as string)
      const userObject = {
        full_name,
        email,
        phone_number,
        password: hashedPassword,
        role_id: defaultRole.id
      }
      const createdUserId = await this.userRepository.createUser(userObject as Prisma.usersCreateArgs['data']).catch(error => {
        throw error
      })
      return createdUserId
    } catch (error) {
      return this.helperFunctions.handleError(error)
    }
  }

  async getUserDetails (whereCondition: object): Promise<IUser | ICustomError> {
    try {
      const userDetails = await this.userRepository.fetchSingleUser({
        where: {
          ...whereCondition
        },
        select: userPublicFields
      })
      return userDetails
    } catch (error) {
      return this.helperFunctions.handleError(error)
    }
  }

  async getAllUser (): Promise<IUser[] | ICustomError> {
    try {
      return this.userRepository.fetchMultipleUsers({
        select: userPublicFields
      }).catch((error) => {
        throw error
      })
    } catch (error) {
      return this.helperFunctions.handleError(error)
    }
  }

  async updateUser (whereCondtion: object, updatedData: IUser): Promise<IUser | ICustomError> {
    let existingUserDetails = await this.userRepository.fetchSingleUser({
      where: {
        ...whereCondtion
      }
    })
    if (!existingUserDetails) {
      throw new CustomError({
        message: 'User not found',
        status: 404
      })
    }

    // validating duplicacy for email and mobileNumber
    existingUserDetails = await this.userRepository.fetchSingleUser({
      where: {
        email: updatedData.email,
        phone_number: updatedData.phone_number,
        NOT: {
          id: updatedData.id
        }
      }
    })
    if (existingUserDetails) {
      throw new CustomError({
        message: 'User with same details already exist',
        status: 409
      })
    }
    await this.userRepository.updateSingleUser({ id: updatedData.id }, updatedData).catch((error) => {
      throw error
    })
    return updatedData
  }

  async deleteUser (whereCondtion: object): Promise<void | ICustomError> {
    try {
      return await this.userRepository.deleteUsers({
        where: {
          ...whereCondtion
        }
      } as Prisma.usersDeleteArgs).catch((error) => {
        throw error
      })
    } catch (error) {
      return this.helperFunctions.handleError(error)
    }
  }

}

export const userService = new UserService(userRepository, helperFunctions, rolesService)