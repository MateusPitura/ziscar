import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountReceivableRepository } from 'src/repositories/account_receivable-repository';
import { AccountReceivableService } from './account-receivable.service';
import { Module } from '@nestjs/common';
import { AccountReceivableController } from './account-receivable.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AccountReceivableController],
  providers: [
    PrismaService,
    {
      provide: AccountReceivableRepository,
      useClass: AccountReceivableService,
    },
    AccountReceivableService,
  ],
  exports: [AccountReceivableRepository, AccountReceivableService],
})
export class AccountReceivableModule {}
