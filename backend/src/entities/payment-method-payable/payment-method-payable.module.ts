import { PrismaService } from 'src/infra/database/prisma.service';
import { PaymentMethodPayableRepository } from 'src/repositories/payment_method_payable-repository';
import { PaymentMethodPayableService } from './payment-method-payable.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    PrismaService,
    {
      provide: PaymentMethodPayableRepository,
      useClass: PaymentMethodPayableService,
    },
    PaymentMethodPayableService,
  ],
  exports: [PaymentMethodPayableRepository, PaymentMethodPayableService],
})
export class PaymentMethodPayableModule {}
