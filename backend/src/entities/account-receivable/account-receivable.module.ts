import { Module } from '@nestjs/common';
import { AccountReceivableController } from './account-receivable.controller';

@Module({
  controllers: [AccountReceivableController],
  providers: [],
})
export class AccountReceivableModule {}
