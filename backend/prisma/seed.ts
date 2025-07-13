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
      {
        id: 5,
        resource: 'VEHICLES',
        action: 'CREATE',
      },
      {
        id: 6,
        resource: 'VEHICLES',
        action: 'READ',
      },
      {
        id: 7,
        resource: 'VEHICLES',
        action: 'UPDATE',
      },
      {
        id: 8,
        resource: 'VEHICLES',
        action: 'DELETE',
      },
      {
        id: 9,
        resource: 'STORES',
        action: 'CREATE',
      },
      {
        id: 10,
        resource: 'STORES',
        action: 'READ',
      },
      {
        id: 11,
        resource: 'STORES',
        action: 'UPDATE',
      },
      {
        id: 12,
        resource: 'STORES',
        action: 'DELETE',
      },
      {
        id: 13,
        resource: 'VEHICLE_PURCHASE',
        action: 'READ',
      },
      {
        id: 14,
        resource: 'VEHICLE_PURCHASE',
        action: 'UPDATE',
      },
      {
        id: 15,
        resource: 'VEHICLE_SALE',
        action: 'READ',
      },
      {
        id: 16,
        resource: 'VEHICLE_SALE',
        action: 'UPDATE',
      },
      {
        id: 17,
        resource: 'VEHICLE_SALE',
        action: 'CREATE',
      },
      {
        id: 18,
        resource: 'VEHICLE_EXPENSE',
        action: 'CREATE',
      },
      {
        id: 19,
        resource: 'VEHICLE_EXPENSE',
        action: 'READ',
      },
      {
        id: 20,
        resource: 'VEHICLE_EXPENSE',
        action: 'UPDATE',
      },
      {
        id: 21,
        resource: 'VEHICLE_EXPENSE',
        action: 'DELETE',
      },
      {
        id: 22,
        resource: 'ACCOUNTS_PAYABLE',
        action: 'CREATE',
      },
      {
        id: 23,
        resource: 'ACCOUNTS_PAYABLE',
        action: 'READ',
      },
      {
        id: 24,
        resource: 'ACCOUNTS_PAYABLE',
        action: 'UPDATE',
      },
      {
        id: 25,
        resource: 'ACCOUNTS_PAYABLE',
        action: 'DELETE',
      },
      {
        id: 26,
        resource: 'ACCOUNTS_RECEIVABLE',
        action: 'CREATE',
      },
      {
        id: 27,
        resource: 'ACCOUNTS_RECEIVABLE',
        action: 'READ',
      },
      {
        id: 28,
        resource: 'ACCOUNTS_RECEIVABLE',
        action: 'UPDATE',
      },
      {
        id: 29,
        resource: 'ACCOUNTS_RECEIVABLE',
        action: 'DELETE',
      },
      {
        id: 30,
        resource: 'CUSTOMERS',
        action: 'CREATE',
      },
      {
        id: 31,
        resource: 'CUSTOMERS',
        action: 'READ',
      },
      {
        id: 32,
        resource: 'CUSTOMERS',
        action: 'UPDATE',
      },
      {
        id: 33,
        resource: 'CUSTOMERS',
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
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 },
        { id: 15 },
        { id: 16 },
        { id: 17 },
        { id: 18 },
        { id: 19 },
        { id: 20 },
        { id: 21 },
        { id: 22 },
        { id: 23 },
        { id: 24 },
        { id: 25 },
        { id: 26 },
        { id: 27 },
        { id: 28 },
        { id: 29 },
        { id: 30 },
        { id: 31 },
        { id: 32 },
        { id: 33 },
      ]),
    ),
    prisma.role.upsert(
      safeUpsertRole(SEED_ROLE_SALES_ID, 'SALES', [
        { id: 6 },
        { id: 15 },
        { id: 16 },
        { id: 17 },
        { id: 30 },
        { id: 31 },
        { id: 32 },
      ]),
    ),
  ]);
}

seed()
  .catch((error) => {
    console.error('❌ Failed to run seed', error);
  })
  .finally(() => void prisma.$disconnect());
