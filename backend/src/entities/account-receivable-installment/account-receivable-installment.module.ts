import { Module } from '@nestjs/common';
import { AccountReceivableInstallmentController } from './account-receivable-installment.controller';

@Module({
  controllers: [AccountReceivableInstallmentController],
  providers: [],
})
export class AccountReceivableInstallmentModule {}
