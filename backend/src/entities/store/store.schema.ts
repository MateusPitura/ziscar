import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';
import { SchemaAddressToCreate, SchemaAddressToUpdate } from 'src/schemas';

const SchemaStorePostInDto = s.object({
  name: s.string(),
  cnpj: s.cnpj(),
  phone: s.phone().nullish(),
  email: s.email().nullish(),
  address: SchemaAddressToCreate.nullish(),
});

const SchemaStoreCreateInDto = SchemaStorePostInDto.extend({
  enterpriseId: s.id(),
});

const SchemaStoreFindManyInDto = s
  .object({
    page: s.numberPositive().optional(),
    status: s.radio(['active', 'inactive']).optional(),
    name: s.string().optional(),
    orderBy: s.radio(['name', 'email']).optional(),
    startDate: s.dateString().optional(),
    endDate: s.dateString().optional(),
  })
  .refine(...s.dateRangeRule);

const SchemaStoreUpdateInDto = SchemaStorePostInDto.extend({
  address: s
    .object({
      remove: s.boolean(),
      add: SchemaAddressToCreate,
      update: SchemaAddressToUpdate,
    })
    .partial(),
  archivedAt: s.date().nullable(),
}).partial();

export const SchemaStoreDeleteInDto = SchemaStoreUpdateInDto.pick({
  archivedAt: true,
});

export const SchemaStorePatchInDto = SchemaStoreUpdateInDto.omit({
  archivedAt: true,
});

export class StorePostInDto extends createZodDto(SchemaStorePostInDto) {}
export class StoreCreateInDto extends createZodDto(SchemaStoreCreateInDto) {}
export class StorePatchInDto extends createZodDto(SchemaStorePatchInDto) {}
export class StoreFindManyInDto extends createZodDto(
  SchemaStoreFindManyInDto,
) {}
export class StoreUpdateInDto extends createZodDto(SchemaStoreUpdateInDto) {}
export class StoreDeleteInDto extends createZodDto(SchemaStoreDeleteInDto) {}
