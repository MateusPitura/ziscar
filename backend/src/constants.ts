import { AuthRequest } from './auth/auth.type';
import { DEFAULT_PERMISSIONS } from './user/user.constant';

export const COOKIE_JWT_NAME = 'jwt';
export const JWT_EXPIRATION_TIME = 43200; // 12h

export const isProduction = process.env.NODE_ENV === 'production';

export const FRONTEND_URL = isProduction
  ? 'https://ziscar.me'
  : 'http://localhost:5173';

export const POPULATE_USER_DEFAULT = {
  id: 150,
  fullName: 'John Doe',
  email: 'john.doe@email.com',
  password: '123456',
  cpf: '12345678901',
  birthDate: '2000-01-01',
};
export const POPULATE_USER_INACTIVE = {
  id: 168,
  fullName: 'Tony Stark',
  email: 'tony.stark@email.com',
  password: '123456',
  cpf: '12345678902',
  isActive: false,
};
export const POPULATE_ORGANIZATION_DEFAULT = {
  id: 443,
  name: 'Wayne Enterprises',
  cnpj: '12345678901234',
};
export const POPULATE_ORGANIZATION_INACTIVE = {
  id: 984,
  name: 'Stark Industries',
  cnpj: '12345678901235',
  isActive: false,
};
export const POPULATE_CLIENT_PRIMARY_ID = 145;
export const POPULATE_CLIENT_SECONDARY_ID = 154;

export const AUTH_REQUEST_DEFAULT = {
  ...new Request('http://localhost:3000'),
  authToken: {
    userId: POPULATE_USER_DEFAULT.id,
    clientId: POPULATE_CLIENT_PRIMARY_ID,
    jit: '0aaa1cdc-9839-4c3f-879f-b5c037b7af3c',
    permissions: DEFAULT_PERMISSIONS,
  },
} as unknown as AuthRequest;
