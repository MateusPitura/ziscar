import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const SchemaUserPostInDto = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cpf: s.cpf().optional(),
  birthDate: s.birthDate().optional(),
  code: s.string().optional(),
  cellPhone: s.cellphone().optional(),
  address: s.SchemaAddress.optional(),
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
  address: s.SchemaAddress.partial().optional(),
  isActive: s.boolean().optional(),
});

export const SchemaUserUpdateInDto = SchemaUserPatchInDto;

export class UserPostInDto extends createZodDto(SchemaUserPostInDto) {}
export class UserCreateInDto extends createZodDto(SchemaUserCreateInDto) {}
export class UserFetchInDto extends createZodDto(SchemaUserFetchInDto) {}
export class UserFindManyInDto extends createZodDto(SchemaUserFindManyInDto) {}
export class UserPatchInDto extends createZodDto(SchemaUserPatchInDto) {}
export class UserUpdateInDto extends createZodDto(SchemaUserUpdateInDto) {}
