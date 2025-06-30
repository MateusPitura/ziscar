import { Permissions } from '@shared/types';
import { AddressNullableFields } from './user.type';

export const GET_USER = {
  id: true,
  isActive: true,
  fullName: true,
  email: true,
  cpf: true,
  birthDate: true,
  code: true,
  cellPhone: true,
  address: true,
  roleId: true,
};

export const FETCH_USER = {
  id: true,
  fullName: true,
  email: true,
  cellPhone: true,
  roleId: true,
  isActive: true,
};

export const GET_PERMISSIONS = {
  role: {
    select: {
      name: true,
      permissions: {
        select: {
          resource: true,
          action: true,
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
};

export const adddressNullableFields: Record<keyof AddressNullableFields, null> =
  {
    neighborhood: null,
    city: null,
    state: null,
    street: null,
    complement: null,
  };
