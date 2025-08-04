import { PrismaClient } from "@prisma/client";
import { prisma } from "../db/dbConnection";
import { IRolesRepository, IRoles } from "../common/interfaces/roles.interface";
import { CustomError } from "../utils/error";

class RolesRepository implements IRolesRepository {
  constructor(private _prisma: PrismaClient) {}

  async getDefaultRole(): Promise<IRoles> {
    try {
      const role = await this._prisma.roles.findFirst({
        where: { name: 'customer' },
      });

      if (!role) {
        throw new CustomError({
          message: 'No Default Role Found',
          status: 404
        });
      }
      return role;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export default new RolesRepository(prisma);
