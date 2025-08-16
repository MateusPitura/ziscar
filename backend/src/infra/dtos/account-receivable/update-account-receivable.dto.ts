import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const updateAccountReceivableDTO = s.object({
  description: s.string(),
  receivedFrom: s.string(),
});

export class UpdateAccountReceivableDTO extends createZodDto(
  updateAccountReceivableDTO,
) {}
