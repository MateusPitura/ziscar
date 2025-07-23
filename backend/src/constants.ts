import { User } from '@prisma/client';
import { FRONTEND_PORT } from '../../shared/src/constants';
import { AuthRequest } from './auth/auth.type';
import { DEFAULT_PERMISSIONS } from './entities/user/user.constant';

export const JWT_EXPIRATION_TIME = 43200; // 12h

export const isProduction = process.env.NODE_ENV === 'production';

export const FRONTEND_URL = isProduction
  ? 'https://ziscar.me'
  : `http://localhost:${FRONTEND_PORT}`;

export const POPULATE_ENTERPRISE_ID = 145;

export const POPULATE_USER_DEFAULT = {
  id: 150,
  fullName: 'John Doe',
  email: 'john.doe@email.com',
  password: '123456',
  cpf: '12345678901',
};

export const POPULATE_USER_INACTIVE = {
  id: 168,
  fullName: 'Tony Stark',
  email: 'tony.stark@email.com',
  password: '123456',
  cpf: '12345678902',
  archivedAt: new Date()
};

export const RANDOM_URL = 'http://localhost:8080';

export const AUTH_REQUEST_DEFAULT = {
  ...new Request(RANDOM_URL),
  authToken: {
    userId: POPULATE_USER_DEFAULT.id,
    enterpriseId: POPULATE_ENTERPRISE_ID,
    jit: '0aaa1cdc-9839-4c3f-879f-b5c037b7af3c',
    permissions: DEFAULT_PERMISSIONS,
  },
} as unknown as AuthRequest;
