import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountPayableInstallmentRepository } from 'src/repositories/account_payable_installment-repository';
import { AccountPayableInstallmentService } from './account-payable-installment.service';
import { Module } from '@nestjs/common';
import { AccountPayableInstallmentController } from './account-payable-installment.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    UserModule, // <-- Adicionar UserModule
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    PrismaService,
    {
      provide: AccountPayableInstallmentRepository,
      useClass: AccountPayableInstallmentService,
    },
    AccountPayableInstallmentService,
  ],
  controllers: [AccountPayableInstallmentController],
  exports: [
    AccountPayableInstallmentRepository,
    AccountPayableInstallmentService,
  ],
})
export class AccountPayableInstallmentModule { }
