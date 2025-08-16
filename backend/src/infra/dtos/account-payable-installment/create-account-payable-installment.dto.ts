import { createAccountPayableInstallmentDTO } from '@shared/dtos/account-payable.dto';
import { createZodDto } from 'nestjs-zod';

export class CreateAccountPayableInstallmentDTO extends createZodDto(
  createAccountPayableInstallmentDTO,
) {}
