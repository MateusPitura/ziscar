import { updateAccountPayableDTO } from '@shared/dtos/account-payable.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateAccountPayableDTO extends createZodDto(
  updateAccountPayableDTO,
) {}
