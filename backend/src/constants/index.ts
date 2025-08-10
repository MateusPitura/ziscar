import { FRONTEND_PORT } from '../../../shared/src/constants';
import { AuthRequest } from '../../src/entities/auth/auth.type';
import { DEFAULT_PERMISSIONS } from '../../src/entities/user/user.constant';
import { AddressNullableFields } from '../../src/entities/user/user.type';
import { POPULATE_USER, POPULATE_ENTERPRISE } from './populate';

export const JWT_EXPIRATION_TIME = 43200; // 12h

export const isProduction = process.env.NODE_ENV === 'production';

export const FRONTEND_URL = isProduction
  ? 'https://ziscar.me'
  : `http://localhost:${FRONTEND_PORT}`;

export const RANDOM_URL = 'http://localhost:8080';

export const AUTH_REQUEST_DEFAULT = {
  ...new Request(RANDOM_URL),
  authToken: {
    userId: POPULATE_USER.ADM.id,
    enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    jit: '0aaa1cdc-9839-4c3f-879f-b5c037b7af3c',
    permissions: DEFAULT_PERMISSIONS,
  },
} as unknown as AuthRequest;

export const addressNullableFields: Record<keyof AddressNullableFields, null> =
  {
    neighborhood: null,
    cityIbgeCode: null,
    street: null,
  };

export const POPULATE_OTHER_ENTITIES_AMOUNT = 30;
export const POPULATE_INACTIVE_ENTITIES_AMOUNT = 5;
