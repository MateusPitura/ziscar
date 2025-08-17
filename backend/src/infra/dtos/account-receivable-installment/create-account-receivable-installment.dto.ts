import { createAccountReceivableInstallmentDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class CreateAccountReceivableInstallmentDTO extends createZodDto(
  createAccountReceivableInstallmentDTO,
) {}
