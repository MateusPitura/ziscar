import { Transactionable } from 'src/types';
import { Prisma } from '@prisma/client';
import { StoreCreateInDto } from './store.schema';

export interface CreateInput extends Transactionable {
  storeCreateInDto: StoreCreateInDto;
}

export interface FindOneInput {
  enterpriseId?: number;
  where: Prisma.StoreWhereUniqueInput;
  select: Prisma.StoreSelect;
  onlyActive?: boolean;
}

export interface VerifyDuplicatedInput {
  cnpj?: string;
}
