import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountReceivableInstallmentRepository } from 'src/repositories/account_receivable_installment-repository';
import { UserModule } from '../user/user.module';
import { AccountReceivableInstallmentController } from './account-receivable-installment.controller';
import { AccountReceivableInstallmentService } from './account-receivable-installment.service';

@Module({
  imports: [UserModule],
  controllers: [AccountReceivableInstallmentController],
  providers: [
    PrismaService,
    {
      provide: AccountReceivableInstallmentRepository,
      useClass: AccountReceivableInstallmentService,
    },
    AccountReceivableInstallmentService,
  ],
  exports: [
    AccountReceivableInstallmentRepository,
    AccountReceivableInstallmentService,
  ],
})
export class AccountReceivableInstallmentModule {}
