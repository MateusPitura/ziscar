import { updateAccountReceivableInstallmentDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class UpdateAccountReceivableInstallmentDTO extends createZodDto(
  updateAccountReceivableInstallmentDTO,
) {}
