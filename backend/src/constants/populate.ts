import {
  SEED_ROLE_ADMIN_ID,
  SEED_ROLE_SALES_ID,
} from '../../../shared/src/constants';

export const POPULATE_ENTERPRISE = {
  DEFAULT: {
    id: 145,
  },
  OUTER: {
    id: 154,
  },
};

export const POPULATE_USER = {
  ADM: {
    id: 150,
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    password: 'Senha12345@',
    cpf: '91228253048',
    archivedAt: null,
    roleId: SEED_ROLE_ADMIN_ID,
  },
  SALES: {
    id: 155,
    fullName: 'John Sales',
    email: 'john.sales@email.com',
    password: 'Senha12345@',
    cpf: '87585341059',
    archivedAt: null,
    roleId: SEED_ROLE_SALES_ID,
  },
  INACTIVE: {
    id: 168,
    fullName: 'Tony Stark',
    email: 'tony.stark@email.com',
    password: 'Senha12345@',
    cpf: '12345678902',
    archivedAt: new Date(),
    roleId: SEED_ROLE_ADMIN_ID,
  },
};

export const POPULATE_STORE = {
  DEFAULT: {
    id: 443,
    name: 'Wayne Enterprises',
    cnpj: '12345678901234',
    email: 'wayne@enterprises.com',
    archivedAt: null,
  },
  INACTIVE: {
    id: 984,
    name: 'Stark Industries',
    cnpj: '12345678901235',
    email: 'stark@industries.com',
    archivedAt: new Date(),
  },
};
