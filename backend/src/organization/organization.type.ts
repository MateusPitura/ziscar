import { Transaction } from 'src/types';
import { OrganizationCreateInDto } from './organization.schema';
import { Prisma } from '@prisma/client';

export interface CreateInput {
  organizationCreateInDto: OrganizationCreateInDto;
  transaction?: Transaction;
}

export interface FindOneInput {
  where: Prisma.OrganizationWhereUniqueInput;
  select: Prisma.OrganizationSelect;
  onlyActive?: boolean;
}

export interface VerifyDuplicatedInput {
  cnpj?: string;
}
