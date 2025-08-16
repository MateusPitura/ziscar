import { createAccountPayableInstallmentDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class CreateAccountPayableInstallmentDTO extends createZodDto(
  createAccountPayableInstallmentDTO,
) {}
