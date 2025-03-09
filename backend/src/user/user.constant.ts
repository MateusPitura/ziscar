import { Permissions } from '@shared/types';

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

export const PERMISSIONS: Permissions = {
  USERS: {
    CREATE: false,
    READ: false,
    UPDATE: false,
    DELETE: false,
  },
};
