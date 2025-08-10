import { FRONTEND_PORT } from '../../shared/src/constants';
import { AuthRequest } from './entities/auth/auth.type';
import { DEFAULT_PERMISSIONS } from './entities/user/user.constant';
import { AddressNullableFields } from './entities/user/user.type';

export const JWT_EXPIRATION_TIME = 43200; // 12h

export const isProduction = process.env.NODE_ENV === 'production';

export const FRONTEND_URL = isProduction
  ? 'https://ziscar.me'
  : `http://localhost:${FRONTEND_PORT}`;

export const POPULATE_ENTERPRISE_PRIMARY_ID = 145;
export const POPULATE_ENTERPRISE_SECONDARY_ID = 154;

export const POPULATE_USER_DEFAULT = {
  id: 150,
  fullName: 'John Doe',
  email: 'john.doe@email.com',
  password: 'Senha12345@',
  cpf: '91228253048',
};

export const POPULATE_USER_INACTIVE = {
  id: 168,
  fullName: 'Tony Stark',
  email: 'tony.stark@email.com',
  password: 'Senha12345@',
  cpf: '12345678902',
  archivedAt: new Date(),
};

export const RANDOM_URL = 'http://localhost:8080';

export const AUTH_REQUEST_DEFAULT = {
  ...new Request(RANDOM_URL),
  authToken: {
    userId: POPULATE_USER_DEFAULT.id,
    enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    jit: '0aaa1cdc-9839-4c3f-879f-b5c037b7af3c',
    permissions: DEFAULT_PERMISSIONS,
  },
} as unknown as AuthRequest;

export const POPULATE_STORE_DEFAULT = {
  id: 443,
  name: 'Wayne Enterprises',
  cnpj: '12345678901234',
  email: 'wayne@enterprises.com',
};
export const POPULATE_STORE_INACTIVE = {
  id: 984,
  name: 'Stark Industries',
  cnpj: '12345678901235',
  email: 'stark@industries.com',
  archivedAt: new Date(),
};

export const addressNullableFields: Record<keyof AddressNullableFields, null> =
  {
    neighborhood: null,
    cityIbgeCode: null,
    street: null,
  };
