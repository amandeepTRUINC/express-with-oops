import { prisma } from "../db/dbConnection";
import { hashPassword } from "../utils/helperFunctions";

export const seedDefaultUsers = async () => {
  try {
    const users = [
      {
        full_name: 'Admin',
        email: 'amandeep@admin.com',
        phone_number: "6866685881",
        password: 'test-1234',
        company_name: 'Tru Inc.',
        role: 'admin'
      },
      {
        full_name: 'Admin',
        email: 'himanshu@admin.com',
        phone_number: "6866685882",
        password: 'test-1234',
        company_name: 'Tru Inc.',
        role: 'admin'
      },
      {
        full_name: 'Customer',
        email: 'himanshu@customer.com',
        phone_number: "6866685883",
        password: 'test-1234',
        company_name: 'Tru Inc.',
        role: 'customer'
      },
      {
        full_name: 'Customer',
        email: 'amandeep@customer.com',
        phone_number: "6866685884",
        password: 'test-1234',
        company_name: 'Tru Inc.',
        role: 'customer'
      },
      {
        full_name: 'Restaurant Owner',
        email: 'amandeep@restaurantOwner.com',
        phone_number: "6866685885",
        password: 'test-1234',
        company_name: 'Tru Inc.',
        role: 'restaurant_owner'
      },
      {
        full_name: 'Restaurant Owner',
        email: 'himanshu@restaurantOwner.com',
        phone_number: "6866685886",
        password: 'test-1234',
        company_name: 'Tru Inc.',
        role: 'restaurant_owner'
      }
    ];

    // Get role IDs from DB
    const rolesFromDb = await prisma.roles.findMany({
      select: { id: true, name: true }
    });

    const roleMap: Record<string, number> = {};
    rolesFromDb.forEach(r => {
      roleMap[r.name] = r.id;
    });

    const usersWithRoleIds = await Promise.all(
      users.map(async (user) => {
        const roleId = roleMap[user.role];
        if (!roleId) {
          throw new Error(`Role not found for: ${user.role}`);
        }
        return {
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          password: await hashPassword(user.password),
          company_name: user.company_name,
          role_id: roleId
        };
      })
    );

    // Insert into DB
    await prisma.users.createMany({
      data: usersWithRoleIds as any[],
      skipDuplicates: true
    });

    console.log('✅ Default users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Users:', error);
  } finally {
    await prisma.$disconnect();
  }
};
