import { Module } from '@nestjs/common';
import { PaymentMethodPayableController } from './payment-method-payable.controller';

@Module({
  controllers: [PaymentMethodPayableController],
  providers: [],
})
export class PaymentMethodPayableModule {}
