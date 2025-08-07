// src/seeds/seedRoles.ts
import { PrismaClient } from '@prisma/client';
import rolesRepository from '../repositories/roles.repository';
import { roles_enum } from '../interfaces/roles.interface';

const prisma = new PrismaClient();

// FIX 1: Convert enum to array of role names (just values, not entries)
const defaultRoles = Object.values(roles_enum); // Now it's: ['ADMIN', 'CUSTOMER', ...] — all strings

export const seedDefaultRoles = async () => {
  try {
    const existingRoles = await rolesRepository.fetchMultipleData({
      where: {
        name: { in: defaultRoles },
      },
      select: {
        name: true,
      },
    });

    const existingRoleNames = new Set(existingRoles.map(role => role.name));

    const rolesToInsert = defaultRoles
      .filter(role => !existingRoleNames.has(role))
      .map(role => ({ name: role }));

    if (rolesToInsert.length > 0) {
      // FIX 2: Correct structure for createMany (only pass `data` and `skipDuplicates`)
      await rolesRepository.insertMany({
        data: rolesToInsert,
        skipDuplicates: true,
      });

      console.log(`✅ Inserted roles: ${rolesToInsert.map(r => r.name).join(', ')}`);
    } else {
      console.log('⚠️ All roles already exist. No new roles inserted.');
    }
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
  } finally {
    await prisma.$disconnect();
  }
};
