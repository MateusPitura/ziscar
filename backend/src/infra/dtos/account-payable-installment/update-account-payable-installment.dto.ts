import { updateAccountPayableInstallmentDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class UpdateAccountPayableInstallmentDTO extends createZodDto(
  updateAccountPayableInstallmentDTO,
) {}
