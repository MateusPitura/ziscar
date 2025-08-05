import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const SchemaStoreCreateInDto = s.object({
  name: s.string(),
  cnpj: s.cnpj(),
  enterpriseId: s.id(),
});

export class StoreCreateInDto extends createZodDto(SchemaStoreCreateInDto) { }
