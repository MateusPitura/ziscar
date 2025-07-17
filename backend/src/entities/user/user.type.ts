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
  clientId: number;
  paginate?: boolean;
  select?: Prisma.UserSelect;
}

export interface FindOneInput {
  clientId?: number;
  where: Prisma.UserWhereUniqueInput;
  select: Prisma.UserSelect;
  onlyActive?: boolean;
  showNotFoundError?: boolean;
}

export interface UpdateInput {
  clientId?: number;
  where: Prisma.UserWhereUniqueInput;
  userUpdateInDto: UserUpdateInDto;
  select?: Prisma.UserSelect;
  showNotFoundError?: boolean;
}

export interface GeneratePdfInput {
  clientId: number;
  userGeneratePdfInDto: UserGeneratePdfInDto;
  userId: number;
}

export interface GenerateSheetInput {
  clientId: number;
  userGenerateSheetInDto: UserGenerateSheetInDto;
  userId: number;
}

export interface GetPermissionsInput {
  clientId: number;
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
