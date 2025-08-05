
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