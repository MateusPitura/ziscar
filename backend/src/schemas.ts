import { s } from '@shared/safeZod';

export const SchemaParam = s.object({
  id: s.id(),
});

const SchemaAddress = s.object({
  street: s.string().nullish(),
  neighborhood: s.string().nullish(),
  cityIbgeCode: s.number().nullish(),
});

export const SchemaAddressToCreate = s.SchemaAddress.extend({
  ...SchemaAddress.shape,
});
export const SchemaAddressToUpdate = s.SchemaAddress.partial().extend({
  ...SchemaAddress.shape,
});

