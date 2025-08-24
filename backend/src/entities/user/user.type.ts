import { Permission, Prisma } from '@prisma/client';
import {
  UserCreateInDto,
  UserFindManyInDto,
  UserUpdateInDto,
} from './user.schema';
import { Transactionable } from 'src/types';

export interface Role {
  permissions?: Permission[];
}

export interface CreateInput extends Transactionable {
  userCreateInDto: UserCreateInDto;
}

export interface FindManyInput {
  userFindManyInDto: UserFindManyInDto;
  userId: number;
  enterpriseId: number;
  select?: Prisma.UserSelect;
}

export interface FindOneInput {
  enterpriseId?: number;
  where: Prisma.UserWhereUniqueInput;
  select: Prisma.UserSelect;
  onlyActive?: boolean;
  showNotFoundError?: boolean;
}

export interface UpdateInput {
  enterpriseId?: number;
  where: Prisma.UserWhereUniqueInput;
  userUpdateInDto: UserUpdateInDto;
  select?: Prisma.UserSelect;
  showNotFoundError?: boolean;
}

export interface GetPermissionsInput {
  enterpriseId: number;
  userId: number;
}

export interface VerifyDuplicatedInput {
  email?: string;
  cpf?: string;
}

export interface RemoveTimeFromDateInput {
  date: Date | null;
}

export type AddressNullableFields = Omit<
  NonNullable<NonNullable<UserUpdateInDto['address']>['update']>,
  'cep' | 'number'
>;
