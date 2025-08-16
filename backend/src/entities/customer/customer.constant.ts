import { Prisma } from '@prisma/client';

export const GET_CUSTOMER: Prisma.CustomerSelect = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  cpf: true,
  archivedAt: true,
  address: {
    omit: {
      cityIbgeCode: true,
    },
    include: {
      city: true,
    },
  },
};

export const FETCH_CUSTOMER: Prisma.CustomerSelect = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  cpf: true,
  archivedAt: true,
};
