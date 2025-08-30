import { createPaymentMethodToInstallmentDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class CreatePaymentMethodDTO extends createZodDto(
  createPaymentMethodToInstallmentDTO,
) {}
