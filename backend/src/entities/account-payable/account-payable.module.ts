import { Module } from '@nestjs/common';
import { AccountPayableController } from './account-payable.controller';

@Module({
  controllers: [AccountPayableController],
  providers: [],
})
export class AccountPayableModule {}
