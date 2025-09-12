import { createPaymentMethodAccountPayableToInstallmentDTO, createPaymentMethodToInstallmentDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class CreatePaymentMethodToAccountPayableDTO extends createZodDto(
    createPaymentMethodAccountPayableToInstallmentDTO,
) { }
