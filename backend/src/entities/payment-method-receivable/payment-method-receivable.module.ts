import { Module } from '@nestjs/common';
import { PaymentMethodReceivableController } from './payment-method-receivable.controller';

@Module({
  controllers: [PaymentMethodReceivableController],
  providers: [],
})
export class PaymentMethodReceivableModule {}
