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
  code: s.string().nullable().optional(),
  cellPhone: s.cellphone().nullable().optional(),
  address: SchemaAddress.optional(),
  roleId: s.id(),
});

const SchemaUserCreateInDto = SchemaUserPostInDto.extend({
  clientId: s.id(),
});

const SchemaUserFindManyInDto = s.object({
  page: s.number().optional(),
  status: s.list(['active', 'inactive']).optional(),
  fullName: s.fullName().optional(),
  orderBy: s.list(['fullName', 'email']).optional(),
});

const SchemaUserGeneratePdfInDto = SchemaUserFindManyInDto.omit({ page: true });

const SchemaUserGenerateSheetInDto = SchemaUserGeneratePdfInDto;

const SchemaUserUpdateInDto = SchemaUserPostInDto.extend({
  address: s
    .object({
      remove: s.boolean(),
      add: SchemaAddress,
      update: SchemaAddress.partial(),
    })
    .partial(),
  password: s.password(),
  isActive: s.boolean(),
  jit: s.string(36).nullable(),
}).partial();

const SchemaProfilePatchInDto = SchemaUserUpdateInDto.omit({
  roleId: true,
  isActive: true,
});

const SchemaUserDeleteInDto = s.object({
  isActive: s.boolean(),
});

export const SchemaUserPatchInDto = SchemaUserUpdateInDto.omit({
  isActive: true,
});

export class UserPostInDto extends createZodDto(SchemaUserPostInDto) {}
export class UserCreateInDto extends createZodDto(SchemaUserCreateInDto) {}
export class UserGeneratePdfInDto extends createZodDto(
  SchemaUserGeneratePdfInDto,
) {}
export class UserGenerateSheetInDto extends createZodDto(
  SchemaUserGenerateSheetInDto,
) {}
export class UserFindManyInDto extends createZodDto(SchemaUserFindManyInDto) {}
export class UserPatchInDto extends createZodDto(SchemaUserPatchInDto) {}
export class ProfilePatchInDto extends createZodDto(SchemaProfilePatchInDto) {}
export class UserDeleteInDto extends createZodDto(SchemaUserDeleteInDto) {}
export class UserUpdateInDto extends createZodDto(SchemaUserUpdateInDto) {}
