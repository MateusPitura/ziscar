import { PrismaClient, RoleType, Resources, Actions, Permission } from '@prisma/client';
import { citiesData } from './seed-data/cities';
import { vehicleBrands } from './seed-data/vehicleBrands';

const prisma = new PrismaClient();

const rolePermissions: Record<RoleType, { resource: Resources; action: Actions }[]> = {
  [RoleType.ADMIN]: [
    { resource: Resources.USERS, action: Actions.CREATE },
    { resource: Resources.USERS, action: Actions.READ },
    { resource: Resources.USERS, action: Actions.UPDATE },
    { resource: Resources.USERS, action: Actions.DELETE },
    { resource: Resources.VEHICLES, action: Actions.CREATE },
    { resource: Resources.VEHICLES, action: Actions.READ },
    { resource: Resources.VEHICLES, action: Actions.UPDATE },
    { resource: Resources.VEHICLES, action: Actions.DELETE },
    { resource: Resources.STORES, action: Actions.CREATE },
    { resource: Resources.STORES, action: Actions.READ },
    { resource: Resources.STORES, action: Actions.UPDATE },
    { resource: Resources.STORES, action: Actions.DELETE },
    { resource: Resources.VEHICLE_PURCHASE, action: Actions.READ },
    { resource: Resources.VEHICLE_PURCHASE, action: Actions.UPDATE },
    { resource: Resources.VEHICLE_SALE, action: Actions.READ },
    { resource: Resources.VEHICLE_SALE, action: Actions.UPDATE },
    { resource: Resources.VEHICLE_SALE, action: Actions.CREATE },
    { resource: Resources.VEHICLE_EXPENSE, action: Actions.CREATE },
    { resource: Resources.VEHICLE_EXPENSE, action: Actions.READ },
    { resource: Resources.VEHICLE_EXPENSE, action: Actions.UPDATE },
    { resource: Resources.VEHICLE_EXPENSE, action: Actions.DELETE },
    { resource: Resources.ACCOUNTS_PAYABLE, action: Actions.CREATE },
    { resource: Resources.ACCOUNTS_PAYABLE, action: Actions.READ },
    { resource: Resources.ACCOUNTS_PAYABLE, action: Actions.UPDATE },
    { resource: Resources.ACCOUNTS_PAYABLE, action: Actions.DELETE },
    { resource: Resources.ACCOUNTS_RECEIVABLE, action: Actions.CREATE },
    { resource: Resources.ACCOUNTS_RECEIVABLE, action: Actions.READ },
    { resource: Resources.ACCOUNTS_RECEIVABLE, action: Actions.UPDATE },
    { resource: Resources.ACCOUNTS_RECEIVABLE, action: Actions.DELETE },
    { resource: Resources.CUSTOMERS, action: Actions.CREATE },
    { resource: Resources.CUSTOMERS, action: Actions.READ },
    { resource: Resources.CUSTOMERS, action: Actions.UPDATE },
    { resource: Resources.CUSTOMERS, action: Actions.DELETE },
  ],
  [RoleType.SELLER]: [
    { resource: Resources.VEHICLES, action: Actions.READ },
    { resource: Resources.VEHICLE_SALE, action: Actions.READ },
    { resource: Resources.VEHICLE_SALE, action: Actions.UPDATE },
    { resource: Resources.VEHICLE_SALE, action: Actions.CREATE },
    { resource: Resources.CUSTOMERS, action: Actions.CREATE },
    { resource: Resources.CUSTOMERS, action: Actions.READ },
    { resource: Resources.CUSTOMERS, action: Actions.UPDATE },
  ],
};

async function seed() {
  await prisma.$transaction(async (tx) => {

  await tx.city.createMany({
    data: citiesData,
    skipDuplicates: true,
  });

  await tx.vehicleBrand.createMany({
    data: vehicleBrands,
    skipDuplicates: true,
  });
    
    const allPermissions = Object.values(rolePermissions).flat();
    await Promise.all(
      allPermissions.map((permission) =>
        tx.permission.upsert({
          where: { resource_action: permission },
          update: {},
          create: permission,
        }),
      ),
    );

    console.log('✅ Permissions created/verified.');

    for (const [roleName, permissions] of Object.entries(rolePermissions)) {
      const permissionsToConnect = await tx.permission.findMany({
        where: {
          OR: permissions,
        },
        select: {
          id: true,
        },
      });

      await tx.role.upsert({
        where: { name: roleName as RoleType },
        update: {
          rolePermissions: {
            deleteMany: {},
            create: permissionsToConnect.map(({ id }) => ({
              permission: {
                connect: { id },
              },
            })),
          },
        },
        create: {
          name: roleName as RoleType,
          rolePermissions: {
            create: permissionsToConnect.map(({ id }) => ({
              permission: {
                connect: { id },
              },
            })),
          },
        },
      });
    }

    console.log(`✅ Role ${RoleType.ADMIN} and ${RoleType.SELLER} created/updated with correct permissions.`);
  });
}

seed()
  .then(() => {
    console.log('🌱 Database seeded successfully.');
  })
  .catch((error) => {
    console.error('❌ Failed to run seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  