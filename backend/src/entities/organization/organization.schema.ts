import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const SchemaOrganizationCreateInDto = s.object({
  name: s.string(),
  cnpj: s.cnpj(),
  clientId: s.id(),
});

export class OrganizationCreateInDto extends createZodDto(
  SchemaOrganizationCreateInDto,
) {}
