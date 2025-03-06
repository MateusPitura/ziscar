import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const SchemaAddress = s.SchemaAddress.extend({
  street: s.string().optional(),
  neighborhood: s.string().optional(),
  city: s.string().optional(),
  state: s.string().optional(),
  complement: s.string().optional(),
});

const SchemaUserPostInDto = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cpf: s.cpf().nullable().optional(),
  birthDate: s.birthDate().nullable().optional(),
  code: s.string().optional(),
  cellPhone: s.cellphone().nullable().optional(),
  address: SchemaAddress.optional(),
  roleId: s.id(),
});

const SchemaUserCreateInDto = SchemaUserPostInDto.extend({
  clientId: s.id(),
});

const SchemaUserFetchInDto = s.object({
  page: s.number().optional(),
  status: s.list(['active', 'inactive']).optional(),
  fullName: s.fullName().optional(),
  orderBy: s.list(['fullName', 'email']).optional(),
});

const SchemaUserFindManyInDto = SchemaUserFetchInDto;

const SchemaUserPatchInDto = SchemaUserPostInDto.partial().extend({
  password: s.password().optional(),
  address: SchemaAddress.partial().optional(),
  isActive: s.boolean().optional(),
});

export const SchemaUserUpdateInDto = SchemaUserPatchInDto;

export class UserPostInDto extends createZodDto(SchemaUserPostInDto) {}
export class UserCreateInDto extends createZodDto(SchemaUserCreateInDto) {}
export class UserFetchInDto extends createZodDto(SchemaUserFetchInDto) {}
export class UserFindManyInDto extends createZodDto(SchemaUserFindManyInDto) {}
export class UserPatchInDto extends createZodDto(SchemaUserPatchInDto) {}
export class UserUpdateInDto extends createZodDto(SchemaUserUpdateInDto) {}
