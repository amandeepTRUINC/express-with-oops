import { Prisma, PrismaClient } from "@prisma/client";
import { IUser, IUserRepository } from "../common/interfaces/user.interface";
import { prisma } from "../db/dbConnection";

class UserRepository implements IUserRepository {

  constructor(private _prisma: PrismaClient) {
  }

  public async createUser (userDetails: Prisma.usersCreateArgs['data']): Promise<number> {
    try {
      const createdUser = await this._prisma.users.create({ data: userDetails })
      return createdUser.id
    } catch (error) {
      throw error
    }
  }

  public async fetchMultipleUsers (whereCondtion: Prisma.usersFindManyArgs): Promise<IUser[]> {
    try {
      const usersList = await this._prisma.users.findMany(whereCondtion)
      return usersList as IUser[]
    } catch (error) {
      throw error
    }
  }

  public async fetchSingleUser (whereCondition: Prisma.usersFindFirstArgs): Promise<IUser> {
    try {
      const userDetails = await this._prisma.users.findFirst(whereCondition)
      return userDetails as IUser
    } catch (error) {
      console.log("error =.", error)
      throw error
    }
  }

  public async updateMultipleUsers (whereCondtion: Prisma.usersWhereInput, updatedData: Prisma.usersUpdateManyArgs['data']): Promise<number> {
    try {
      const updatedResult = await this._prisma.users.updateMany({
        where: {
          ...whereCondtion
        },
        data: updatedData
      })
      return updatedResult.count
    } catch (error) {
      throw error
    }
  }

  public async updateSingleUser (
    whereCondition: Prisma.usersWhereUniqueInput,
    updatedData: Prisma.usersUpdateArgs['data']
  ): Promise<IUser> {
    try {
      const updatedResult = await this._prisma.users.update({
        where: whereCondition,
        data: updatedData
      });
      return updatedResult as IUser;
    } catch (error) {
      throw error;
    }
  }

  public async deleteUsers (whereCondtion: Prisma.usersDeleteArgs): Promise<void> {
    try {
      await this._prisma.users.delete(whereCondtion)
      return
    } catch (error) {
      throw error
    }
  }
}

export const userRepository = new UserRepository(prisma)