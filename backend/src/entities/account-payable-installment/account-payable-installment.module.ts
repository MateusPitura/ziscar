import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountPayableInstallmentRepository } from 'src/repositories/account_payable_installment-repository';
import { AccountPayableInstallmentService } from './account-payable-installment.service';
import { Module } from '@nestjs/common';
@Module({
  providers: [
    PrismaService,
    {
      provide: AccountPayableInstallmentRepository,
      useClass: AccountPayableInstallmentService,
    },
    AccountPayableInstallmentService,
  ],
  exports: [
    AccountPayableInstallmentRepository,
    AccountPayableInstallmentService,
  ],
})
export class AccountPayableInstallmentModule {}
