import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const SchemaAddress = s.object({
  street: s.string().nullish(),
  neighborhood: s.string().nullish(),
  cityIbgeCode: s.number().nullish(),
});

const SchemaAddressToCreate = s.SchemaAddress.extend({
  ...SchemaAddress.shape,
});
const SchemaAddressToUpdate = s.SchemaAddress.partial().extend({
  ...SchemaAddress.shape,
});

const SchemaUserPostInDto = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cpf: s.cpf().nullish(),
  phone: s.cellphone().nullish(),
  address: SchemaAddressToCreate.nullish(),
  roleId: s.id(),
});

const SchemaUserCreateInDto = SchemaUserPostInDto.extend({
  enterpriseId: s.id(),
});

const SchemaUserFindManyInDto = s.object({
  page: s.number().optional(),
  status: s.radio(['active', 'inactive']).optional(),
  fullName: s.fullName().optional(),
  orderBy: s.radio(['fullName', 'email']).optional(),
});

const SchemaUserGeneratePdfInDto = SchemaUserFindManyInDto.omit({ page: true });

const SchemaUserGenerateSheetInDto = SchemaUserGeneratePdfInDto;

const SchemaUserUpdateInDto = SchemaUserPostInDto.extend({
  address: s
    .object({
      remove: s.boolean(),
      add: SchemaAddressToCreate,
      update: SchemaAddressToUpdate,
    })
    .partial(),
  password: s.password(),
  archivedAt: s.date().nullable(),
  jit: s.string(36).nullable(),
})
  .omit({ email: true })
  .partial();

const SchemaProfilePatchInDto = SchemaUserUpdateInDto.omit({
  roleId: true,
  archivedAt: true,
});

const SchemaUserDeleteInDto = s.object({
  archivedAt: s.date().nullable(),
});

export const SchemaUserPatchInDto = SchemaUserUpdateInDto.omit({
  archivedAt: true,
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
export class UserUpdateInDto extends createZodDto(SchemaUserUpdateInDto) {}
export class UserDeleteInDto extends createZodDto(SchemaUserDeleteInDto) {}
