
import { IRoles } from "../interfaces/user.interface";
import rolesRepository from "../repositories/roles.repository";

export const getDefaultRole = async (): Promise<IRoles> => {
  try {
    const roleDetails = await rolesRepository.getDefaultRole().catch((error) => {
      throw error
    })
    return roleDetails as IRoles
  } catch (error: unknown) {
    // You can throw your custom error class here if needed
    throw new Error("Failed to fetch default role");
  }
}

export const getRoleDetails = async (roleName: string): Promise<IRoles> => {
  try {
    const roleDetails = await rolesRepository.fetchSingleData({
      where: {
        name: roleName
      }
    }).catch((error) => {
      throw error
    })
    return roleDetails as IRoles
  } catch (error) {
    throw new Error("Failed to fetch default role");
  }
}