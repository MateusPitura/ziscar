import { PrismaClient, RoleType, Resources, Actions } from '@prisma/client';
import {
  SEED_ROLE_ADMIN_ID,
  SEED_ROLE_SALES_ID,
} from '../../shared/src/constants';

const prisma = new PrismaClient();

function safeUpsertRole(
  id: number,
  name: RoleType,
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
        resource: Resources.USERS,
        action: Actions.CREATE,
      },
      {
        id: 2,
        resource: Resources.USERS,
        action: Actions.READ,
      },
      {
        id: 3,
        resource: Resources.USERS,
        action: Actions.UPDATE,
      },
      {
        id: 4,
        resource: Resources.USERS,
        action: Actions.DELETE,
      },
      {
        id: 5,
        resource: Resources.VEHICLES,
        action: Actions.CREATE,
      },
      {
        id: 6,
        resource: Resources.VEHICLES,
        action: Actions.READ,
      },
      {
        id: 7,
        resource: Resources.VEHICLES,
        action: Actions.UPDATE,
      },
      {
        id: 8,
        resource: Resources.VEHICLES,
        action: Actions.DELETE,
      },
      {
        id: 9,
        resource: Resources.STORES,
        action: Actions.CREATE,
      },
      {
        id: 10,
        resource: Resources.STORES,
        action: Actions.READ,
      },
      {
        id: 11,
        resource: Resources.STORES,
        action: Actions.UPDATE,
      },
      {
        id: 12,
        resource: Resources.STORES,
        action: Actions.DELETE,
      },
      {
        id: 13,
        resource: Resources.VEHICLE_PURCHASE,
        action: Actions.READ,
      },
      {
        id: 14,
        resource: Resources.VEHICLE_PURCHASE,
        action: Actions.UPDATE,
      },
      {
        id: 15,
        resource: Resources.VEHICLE_SALE,
        action: Actions.READ,
      },
      {
        id: 16,
        resource: Resources.VEHICLE_SALE,
        action: Actions.UPDATE,
      },
      {
        id: 17,
        resource: Resources.VEHICLE_SALE,
        action: Actions.CREATE,
      },
      {
        id: 18,
        resource: Resources.VEHICLE_EXPENSE,
        action: Actions.CREATE,
      },
      {
        id: 19,
        resource: Resources.VEHICLE_EXPENSE,
        action: Actions.READ,
      },
      {
        id: 20,
        resource: Resources.VEHICLE_EXPENSE,
        action: Actions.UPDATE,
      },
      {
        id: 21,
        resource: Resources.VEHICLE_EXPENSE,
        action: Actions.DELETE,
      },
      {
        id: 22,
        resource: Resources.ACCOUNTS_PAYABLE,
        action: Actions.CREATE,
      },
      {
        id: 23,
        resource: Resources.ACCOUNTS_PAYABLE,
        action: Actions.READ,
      },
      {
        id: 24,
        resource: Resources.ACCOUNTS_PAYABLE,
        action: Actions.UPDATE,
      },
      {
        id: 25,
        resource: Resources.ACCOUNTS_PAYABLE,
        action: Actions.DELETE,
      },
      {
        id: 26,
        resource: Resources.ACCOUNTS_RECEIVABLE,
        action: Actions.CREATE,
      },
      {
        id: 27,
        resource: Resources.ACCOUNTS_RECEIVABLE,
        action: Actions.READ,
      },
      {
        id: 28,
        resource: Resources.ACCOUNTS_RECEIVABLE,
        action: Actions.UPDATE,
      },
      {
        id: 29,
        resource: Resources.ACCOUNTS_RECEIVABLE,
        action: Actions.DELETE,
      },
      {
        id: 30,
        resource: Resources.CUSTOMERS,
        action: Actions.CREATE,
      },
      {
        id: 31,
        resource: Resources.CUSTOMERS,
        action: Actions.READ,
      },
      {
        id: 32,
        resource: Resources.CUSTOMERS,
        action: Actions.UPDATE,
      },
      {
        id: 33,
        resource: Resources.CUSTOMERS,
        action: Actions.DELETE,
      },
    ],
    skipDuplicates: true,
  });

  await Promise.all([
    prisma.role.upsert(
      safeUpsertRole(SEED_ROLE_ADMIN_ID, RoleType.ADMIN, [
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
      safeUpsertRole(SEED_ROLE_SALES_ID, RoleType.SELLER, [
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
