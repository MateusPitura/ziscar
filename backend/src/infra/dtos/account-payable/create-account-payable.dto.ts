import { createAccountPayableDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class CreateAccountPayableDTO extends createZodDto(
  createAccountPayableDTO,
) {}
