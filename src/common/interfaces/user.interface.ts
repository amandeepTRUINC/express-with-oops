import { Request, Response, NextFunction } from "express"
import { AuthenticatedRequest, ICustomError } from "./common.interface"
import { Prisma } from "@prisma/client"

export interface IRoles {
  id: number
  name: string
}

export interface IUser {
  id: number
  full_name: string
  email: string
  phone_number: string
  password: string
  role_id: number
  status: boolean
}

export interface IUserRepository {
  fetchSingleUser: (whereCondition: Prisma.usersFindFirstArgs) => Promise<IUser | ICustomError>
  fetchMultipleUsers: (whereCondition:  Prisma.usersFindManyArgs) => Promise<IUser[] | ICustomError>
  createUser: (userDetails: Prisma.usersCreateArgs['data']) => Promise<number | ICustomError>
  updateSingleUser: (whereCondtion: Prisma.usersWhereUniqueInput, updatedData: IUser) => Promise<IUser | ICustomError>
  updateMultipleUsers: (whereCondtion: object, updatedData: IUser[]) => Promise<number | ICustomError>
  deleteUsers: (whereCondtion: Prisma.usersDeleteArgs) => Promise<void | ICustomError>
}

export interface IUserService {
  getAllUser: () => Promise<IUser[] | ICustomError>
  getUserDetails: (whereCondition: object) => Promise<IUser | ICustomError>
  createUser: (userDetails: Partial<IUser>) => Promise<number | ICustomError>
  updateUser: (whereCondtion: object, updatedData: IUser) => Promise<IUser | ICustomError>
  deleteUser: (whereCondtion: object) => Promise<void | ICustomError>
}


export interface IUserController {
  getAllUser: (req: AuthenticatedRequest, res: Response) => Promise<Response>;
  getUserDetails: (req: AuthenticatedRequest, res: Response) => Promise<Response>
  createUser: (req: Request, res: Response) => Promise<Response>
  updateUser: (req: AuthenticatedRequest, res: Response) => Promise<Response>
  deleteUser: (req: AuthenticatedRequest, res: Response) => Promise<Response>
}

export interface IUserValdaitions {
  validateUserIdInReq: () => (req: Request, res: Response, next: NextFunction) => void
  validateUpdateUserReq: () => (req: Request, res: Response, next: NextFunction) => void
}