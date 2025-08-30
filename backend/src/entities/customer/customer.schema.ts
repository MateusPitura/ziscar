import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';
import { SchemaAddressToCreate, SchemaAddressToUpdate } from 'src/schemas';

const SchemaCustomerPostInDto = s.object({
  fullName: s.fullName(),
  cpf: s.cpf(),
  phone: s.phone().nullish(),
  email: s.email().nullish(),
  address: SchemaAddressToCreate.nullish(),
});

const SchemaCustomerCreateInDto = SchemaCustomerPostInDto.extend({
  enterpriseId: s.id(),
});

const SchemaCustomerFindManyInDto = s
  .object({
    page: s.numberPositive().optional(),
    status: s.enumeration(['active', 'inactive']).optional(),
    fullName: s.name().optional(),
    orderBy: s.enumeration(['fullName', 'email']).optional(),
    cpf: s.number().nonnegative().optional(),
    startDate: s.dateString().optional(),
    endDate: s.dateString().optional(),
  })
  .refine(...s.dateRangeRule);

const SchemaCustomerUpdateInDto = SchemaCustomerPostInDto.extend({
  address: s
    .object({
      remove: s.boolean(),
      add: SchemaAddressToCreate,
      update: SchemaAddressToUpdate,
    })
    .partial(),
  archivedAt: s.date().nullable(),
}).partial();

export const SchemaCustomerDeleteInDto = SchemaCustomerUpdateInDto.pick({
  archivedAt: true,
});

export const SchemaCustomerPatchInDto = SchemaCustomerUpdateInDto.omit({
  archivedAt: true,
});

export class CustomerPostInDto extends createZodDto(SchemaCustomerPostInDto) {}
export class CustomerCreateInDto extends createZodDto(
  SchemaCustomerCreateInDto,
) {}
export class CustomerPatchInDto extends createZodDto(
  SchemaCustomerPatchInDto,
) {}
export class CustomerFindManyInDto extends createZodDto(
  SchemaCustomerFindManyInDto,
) {}
export class CustomerUpdateInDto extends createZodDto(
  SchemaCustomerUpdateInDto,
) {}
export class CustomerDeleteInDto extends createZodDto(
  SchemaCustomerDeleteInDto,
) {}
