import { PrismaClient, Roles } from '@prisma/client';
import {
  SEED_ROLE_ADMIN_ID,
  SEED_ROLE_SALES_ID,
} from '../../shared/src/constants';

const prisma = new PrismaClient();

function safeUpsertRole(
  id: number,
  name: Roles,
  permissions: { id: number }[],
) {
  return {
    where: { id },
    update: {
      name,
      permissions: {
        set: permissions,
      },
    },
    create: {
      id,
      name,
      permissions: {
        connect: permissions,
      },
    },
  };
}

async function seed() {
  console.log('🌠 Started to seed database');

  await prisma.permission.createMany({
    data: [
      {
        id: 1,
        resource: 'USERS',
        action: 'CREATE',
      },
      {
        id: 2,
        resource: 'USERS',
        action: 'READ',
      },
      {
        id: 3,
        resource: 'USERS',
        action: 'UPDATE',
      },
      {
        id: 4,
        resource: 'USERS',
        action: 'DELETE',
      },
    ],
    skipDuplicates: true,
  });

  await Promise.all([
    prisma.role.upsert(
      safeUpsertRole(SEED_ROLE_ADMIN_ID, 'ADMIN', [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ]),
    ),
    prisma.role.upsert(
      safeUpsertRole(SEED_ROLE_SALES_ID, 'SALES', [{ id: 2 }]),
    ),
  ]);

  console.log('🌠 Successfully seeded database');
}

seed()
  .catch((error) => {
    console.log('🌠 Failed to run seed', error);
    console.error(error);
  })
  .finally(() => void prisma.$disconnect());
