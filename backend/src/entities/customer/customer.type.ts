import { Transactionable } from 'src/types';
import { Prisma } from '@prisma/client';
import {
  CustomerCreateInDto,
  CustomerFindManyInDto,
  CustomerUpdateInDto,
} from './customer.schema';

export interface CreateInput extends Transactionable {
  customerCreateInDto: CustomerCreateInDto;
}

export interface FindManyInput {
  customerFindManyInDto: CustomerFindManyInDto;
  enterpriseId: number;
  paginate?: boolean;
  select?: Prisma.CustomerSelect;
}

export interface FindOneInput {
  enterpriseId?: number;
  where: Prisma.CustomerWhereUniqueInput;
  select: Prisma.CustomerSelect;
  onlyActive?: boolean;
  showNotFoundError?: boolean;
}

export interface UpdateInput {
  enterpriseId?: number;
  where: Prisma.CustomerWhereUniqueInput;
  customerUpdateInDto: CustomerUpdateInDto;
  select?: Prisma.CustomerSelect;
  showNotFoundError?: boolean;
}

export interface VerifyDuplicatedInput {
  cpf?: string;
  email?: string;
}
