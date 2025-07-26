import { Permissions } from '@shared/types';
import { AddressNullableFields } from './user.type';

export const GET_USER = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  password: true,
  cpf: true,
  jit: true,
  archivedAt: true,
  roleId: true,
};

export const FETCH_USER = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  password: true,
  cpf: true,
  jit: true,
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

export const addressNullableFields: Record<keyof AddressNullableFields, null> =
  {
    neighborhood: null,
    city: null,
    state: null,
    street: null,
    complement: null,
  };
