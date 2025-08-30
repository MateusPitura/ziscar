import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';
import { SchemaAddressToCreate, SchemaAddressToUpdate } from 'src/schemas';

const SchemaUserPostInDto = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cpf: s.cpf().nullish(),
  phone: s.phone().nullish(),
  address: SchemaAddressToCreate.nullish(),
  roleId: s.id(),
});

const SchemaUserCreateInDto = SchemaUserPostInDto.extend({
  enterpriseId: s.id(),
});

const SchemaUserFindManyInDto = s
  .object({
    page: s.numberPositive().optional(),
    status: s.enumeration(['active', 'inactive']).optional(),
    fullName: s.name().optional(),
    orderBy: s.enumeration(['fullName', 'email']).optional(),
    startDate: s.dateString().optional(),
    endDate: s.dateString().optional(),
  })
  .refine(...s.dateRangeRule);

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

export const SchemaUserDeleteInDto = SchemaUserUpdateInDto.pick({
  archivedAt: true,
});

export const SchemaUserPatchInDto = SchemaUserUpdateInDto.omit({
  archivedAt: true,
});

export class UserPostInDto extends createZodDto(SchemaUserPostInDto) {}
export class UserCreateInDto extends createZodDto(SchemaUserCreateInDto) {}
export class UserFindManyInDto extends createZodDto(SchemaUserFindManyInDto) {}
export class UserPatchInDto extends createZodDto(SchemaUserPatchInDto) {}
export class ProfilePatchInDto extends createZodDto(SchemaProfilePatchInDto) {}
export class UserUpdateInDto extends createZodDto(SchemaUserUpdateInDto) {}
export class UserDeleteInDto extends createZodDto(SchemaUserDeleteInDto) {}
