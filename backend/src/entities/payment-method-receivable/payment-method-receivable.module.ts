import { PrismaService } from 'src/infra/database/prisma.service';
import { PaymentMethodReceivableRepository } from 'src/repositories/payment_method_receivable-repository';
import { PaymentMethodReceivableService } from './payment-method-receivable.service';
import { Module } from '@nestjs/common';
import { PaymentMethodReceivableController } from './payment-method-receivable.controller';

@Module({
  controllers: [PaymentMethodReceivableController],
  providers: [PrismaService,
    {
      provide: PaymentMethodReceivableRepository,
      useClass: PaymentMethodReceivableService,
    },
    PaymentMethodReceivableService,],
  exports: [PaymentMethodReceivableRepository, PaymentMethodReceivableService],
})
export class PaymentMethodReceivableModule {}
