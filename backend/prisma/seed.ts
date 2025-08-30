import { PrismaClient, RoleType } from '@prisma/client';
import { citiesData } from './seed-data/cities';
import { vehicleBrands } from './seed-data/vehicleBrands';
import { rolePermissions } from './seed-data/rolePermissions';

const prisma = new PrismaClient();

async function seed() {
  await prisma.$transaction(async (tx) => {
    console.log('🌱 Starting database seeding...');

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
  .finally(() => {
    void prisma.$disconnect();
  });
