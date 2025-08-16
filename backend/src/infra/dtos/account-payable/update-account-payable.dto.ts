import { updateAccountPayableDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class UpdateAccountPayableDTO extends createZodDto(
  updateAccountPayableDTO,
) {}
