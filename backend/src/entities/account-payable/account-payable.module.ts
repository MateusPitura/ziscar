import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountPayableRepository } from 'src/repositories/account_payable-repository';
import { AccountPayableService } from './account-payable.service';
import { Module } from '@nestjs/common';
import { AccountPayableController } from './account-payable.controller';

@Module({
  controllers: [AccountPayableController],
  providers: [PrismaService,
    {
      provide: AccountPayableRepository,
      useClass: AccountPayableService,
    },
    AccountPayableService,],
  exports: [AccountPayableRepository, AccountPayableService],
})
export class AccountPayableModule {}
