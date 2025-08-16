import { updateAccountPayableInstallmentDTO } from '@shared/dtos/account-payable.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateAccountPayableInstallmentDTO extends createZodDto(
  updateAccountPayableInstallmentDTO,
) {}
