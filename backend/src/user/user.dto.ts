import { Prisma } from '@prisma/client';

class AddressCreateInDto {
  cep: string;
  number: string;
  street?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  complement?: string;
}

export class UserCreateInDto {
  fullName: string;
  email: string;
  cpf?: string;
  birthDate?: Date;
  code?: string;
  cellPhone?: string;
  address?: AddressCreateInDto;
  clientId: number;
  roleId: number;
}

export type UserUpdateInDto = Prisma.UserUpdateInput & {
  address?: Prisma.AddressUpdateInput | Prisma.AddressCreateInput; // mudar essa tipagem
};

export class UserFindAllInDto {
  page?: number;
  status?: 'active' | 'inactive';
  fullName?: string;
  orderBy?: 'fullName' | 'email';
}
