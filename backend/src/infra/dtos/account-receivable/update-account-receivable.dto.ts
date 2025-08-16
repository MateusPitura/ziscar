import { updateAccountReceivableDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class UpdateAccountReceivableDTO extends createZodDto(
  updateAccountReceivableDTO,
) {}
