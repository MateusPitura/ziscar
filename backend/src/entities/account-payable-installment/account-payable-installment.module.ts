import { Module } from '@nestjs/common';
import { AccountPayableInstallmentController } from './account-payable-installment.controller';

@Module({
  controllers: [AccountPayableInstallmentController],
  providers: [],
})
export class AccountPayableInstallmentModule {}
