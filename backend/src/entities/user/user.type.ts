import { Permission, Prisma } from '@prisma/client';
import {
  UserCreateInDto,
  UserFindManyInDto,
  UserGeneratePdfInDto,
  UserGenerateSheetInDto,
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
  paginate?: boolean;
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

export interface GeneratePdfInput {
  enterpriseId: number;
  userGeneratePdfInDto: UserGeneratePdfInDto;
  userId: number;
}

export interface GenerateSheetInput {
  enterpriseId: number;
  userGenerateSheetInDto: UserGenerateSheetInDto;
  userId: number;
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
