import { createAccountPayableDTO } from '@shared/dtos/account-payable.dto';
import { createZodDto } from 'nestjs-zod';

export class CreateAccountPayableDTO extends createZodDto(
  createAccountPayableDTO,
) {}
