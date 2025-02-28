import { Prisma } from '@prisma/client';

export class UserCreateInDto {
  email: string;
  fullName: string;
  password: string;
  clientId: number;
  roleId: number;
}

export type UserUpdateInDto = Prisma.UserUpdateInput & {
  address?: Prisma.AddressUpdateInput | Prisma.AddressCreateInput;
};

export class UserFindAllInDto {
  page?: number;
  status?: 'active' | 'inactive';
  fullName?: string;
  orderBy?: 'fullName' | 'email';
}
