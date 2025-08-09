import { Prisma } from "@prisma/client";

export const GET_STORE: Prisma.StoreSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  cnpj: true,
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


export const FETCH_STORE: Prisma.StoreSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  cnpj: true,
  archivedAt: true,
};