import { IRoles, IRolesRepository, IRolesService } from "../common/interfaces/roles.interface";
import rolesRepository from "../repositories/roles.repository";

class RolesService implements IRolesService {
  constructor(private rolesRepo: IRolesRepository) {}

  async getDefaultRole(): Promise<IRoles> {
    try {
      const roleDetails = await this.rolesRepo.getDefaultRole().catch((error) => {
        throw error
      })
      return roleDetails as IRoles
    } catch (error: unknown) {
      // You can throw your custom error class here if needed
      throw new Error("Failed to fetch default role");
    }
  }
}

export default new RolesService(rolesRepository)