import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountReceivableInstallmentRepository } from 'src/repositories/account_receivable_installment-repository';
import { AccountReceivableInstallmentService } from './account-receivable-installment.service';
import { Module } from '@nestjs/common';
import { AccountReceivableInstallmentController } from './account-receivable-installment.controller';
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
export class AccountReceivableInstallmentModule { }
