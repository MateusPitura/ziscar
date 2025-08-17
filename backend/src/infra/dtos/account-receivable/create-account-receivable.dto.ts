import { createZodDto } from 'nestjs-zod';
import { createAccountReceivableDTO } from '@shared/dtos';

export class CreateAccountReceivableDTO extends createZodDto(
  createAccountReceivableDTO,
) {}
