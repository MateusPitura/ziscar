import { s } from '@shared/safeZod';

export const SchemaOrganizationCreateInDto = s.object({
  name: s.string(),
  cnpj: s.cnpj(),
  clientId: s.id(),
});

export type OrganizationCreateInDtoInputs = s.infer<
  typeof SchemaOrganizationCreateInDto
>;
