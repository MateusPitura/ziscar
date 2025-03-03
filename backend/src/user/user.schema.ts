import { s } from '@shared/safeZod';

export const SchemaUserPostInDto = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cpf: s.cpf().optional(),
  birthDate: s.birthDate().optional(),
  code: s.string().optional(),
  cellPhone: s.cellphone().optional(),
  address: s.SchemaAddress.optional(),
  roleId: s.id(),
});

export const SchemaUserCreateInDto = SchemaUserPostInDto.extend({
  clientId: s.id(),
});

export const SchemaUserFetchInDto = s.object({
  page: s.number().optional(),
  status: s.list(['active', 'inactive']).optional(),
  fullName: s.fullName().optional(),
  orderBy: s.list(['fullName', 'email']).optional(),
});

export const SchemaUserFindManyInDto = SchemaUserFetchInDto;

export const SchemaUserPatchInDto = SchemaUserPostInDto.partial().extend({
  password: s.password().optional(),
  address: s.SchemaAddress.partial().optional(),
  isActive: s.boolean().optional(),
});

export const SchemaUserUpdateInDto = SchemaUserPatchInDto;

export type UserPostInDtoInputs = s.infer<typeof SchemaUserPostInDto>;
export type UserCreateInDtoInputs = s.infer<typeof SchemaUserCreateInDto>;
export type UserFetchInDtoInputs = s.infer<typeof SchemaUserFetchInDto>;
export type UserFindManyInDtoInputs = s.infer<typeof SchemaUserFindManyInDto>;
export type UserPatchInDtoInputs = s.infer<typeof SchemaUserPatchInDto>;
export type UserUpdateInDtoInputs = s.infer<typeof SchemaUserUpdateInDto>;
