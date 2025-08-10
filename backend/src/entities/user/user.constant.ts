import { Permissions } from '@shared/types';
import { Prisma } from '@prisma/client';

export const GET_USER: Prisma.UserSelect = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  cpf: true,
  archivedAt: true,
  roleId: true,
  address: {
    omit: {
      cityIbgeCode: true,
    },
    include: {
      city: true,
    },
  },
};

export const FETCH_USER: Prisma.UserSelect = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  cpf: true,
  archivedAt: true,
  roleId: true,
};

export const GET_PERMISSIONS = {
  role: {
    select: {
      id: true,
      name: true,
      rolePermissions: {
        select: {
          permission: {
            select: {
              id: true,
              resource: true,
              action: true,
            },
          },
        },
      },
    },
  },
};

export const DEFAULT_PERMISSIONS: Permissions = {
  USERS: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
  VEHICLES: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
  STORES: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
  VEHICLE_PURCHASE: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
  VEHICLE_EXPENSE: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
  VEHICLE_SALE: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
  ACCOUNTS_PAYABLE: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
  ACCOUNTS_RECEIVABLE: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
  CUSTOMERS: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
};

