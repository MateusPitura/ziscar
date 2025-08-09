import { Transactionable } from 'src/types';
import { Prisma } from '@prisma/client';
import { StoreCreateInDto, StoreFindManyInDto, StoreUpdateInDto } from './store.schema';

export interface CreateInput extends Transactionable {
  storeCreateInDto: StoreCreateInDto;
}

export interface FindManyInput {
  storeFindManyInDto: StoreFindManyInDto;
  enterpriseId: number;
  paginate?: boolean;
  select?: Prisma.StoreSelect;
}

export interface FindOneInput {
  enterpriseId?: number;
  where: Prisma.StoreWhereUniqueInput;
  select: Prisma.StoreSelect;
  onlyActive?: boolean;
  showNotFoundError?: boolean;
}

export interface UpdateInput {
  enterpriseId?: number;
  where: Prisma.StoreWhereUniqueInput;
  storeUpdateInDto: StoreUpdateInDto;
  select?: Prisma.StoreSelect;
  showNotFoundError?: boolean;
}

export interface VerifyDuplicatedInput {
  cnpj?: string;
  email?: string;
}
