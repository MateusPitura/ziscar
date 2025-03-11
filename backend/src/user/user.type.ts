import { Permission, Prisma } from '@prisma/client';
import {
  UserCreateInDto,
  UserFindManyInDto,
  UserGeneratePdfInDto,
  UserGenerateSheetInDto,
  UserUpdateInDto,
} from './user.schema';
import { Transaction } from 'src/types';

export interface Role {
  permissions?: Permission[];
}

export interface CreateInput {
  userCreateInDto: UserCreateInDto;
  transaction?: Transaction;
}

export interface FindManyInput {
  userFindManyInDto: UserFindManyInDto;
  userId: number;
  paginate?: boolean;
  select?: Prisma.UserSelect;
}

export interface FindOneInput {
  where: Prisma.UserWhereUniqueInput;
  select: Prisma.UserSelect;
  onlyActive?: boolean;
  showNotFoundError?: boolean;
}

export interface UpdateInput {
  where: Prisma.UserWhereUniqueInput;
  userUpdateInDto: UserUpdateInDto;
}

export interface GeneratePdfInput {
  userGeneratePdfInDto: UserGeneratePdfInDto;
  userId: number;
}

export interface GenerateSheetInput {
  userGenerateSheetInDto: UserGenerateSheetInDto;
  userId: number;
}

export interface GetPermissionsInput {
  userId: number;
}

export interface VerifyDuplicatedInput {
  email?: string;
  cpf?: string;
}
