import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleExpenseRepository } from 'src/repositories/vehicle_expense-repository';
import { VehicleExpenseService } from './vehicle-expense.service';
import { Module } from '@nestjs/common';
import { InsertExpenseUseCase } from './use-case/insert-expense.use-case';
import { GetVehicleExpenseByIdUseCase } from './use-case/get-vehicle-expense-by-id.use-case';
import { UpdateVehicleExpenseUseCase } from './use-case/update-vehicle-expense.use-case';
import { ArchiveVehicleExpenseUseCase } from './use-case/archive-vehicle-expense.use-case';
import { UnarchiveVehicleExpenseUseCase } from './use-case/unarchive-vehicle-expense.use-case';
import { UserModule } from '../user/user.module';
import { AccountPayableModule } from '../account-payable/account-payable.module';
import { AccountPayableInstallmentModule } from '../account-payable-installment/account-payable-installment.module';
import { PaymentMethodPayableModule } from '../payment-method-payable/payment-method-payable.module';
import { AccountReceivableModule } from '../account-receivable/account-receivable.module';
import { AccountReceivableInstallmentModule } from '../account-receivable-installment/account-receivable-installment.module';
import { FetchVehicleExpensesUseCase } from './use-case/fetch-vehicle-expenses.use-case';
import { VehicleExpenseController } from './vehicle-expense.controller';

@Module({
  imports: [
    UserModule,
    AccountPayableModule,
    AccountPayableInstallmentModule,
    PaymentMethodPayableModule,
    AccountReceivableModule,
    AccountReceivableInstallmentModule,
  ],
  controllers: [VehicleExpenseController],
  providers: [
    PrismaService,
    {
      provide: VehicleExpenseRepository,
      useClass: VehicleExpenseService,
    },
    VehicleExpenseService,
    InsertExpenseUseCase,
    FetchVehicleExpensesUseCase,
    GetVehicleExpenseByIdUseCase,
    UpdateVehicleExpenseUseCase,
    ArchiveVehicleExpenseUseCase,
    UnarchiveVehicleExpenseUseCase,
  ],
  exports: [
    VehicleExpenseRepository,
    VehicleExpenseService,
    InsertExpenseUseCase,
    FetchVehicleExpensesUseCase,
    GetVehicleExpenseByIdUseCase,
    UpdateVehicleExpenseUseCase,
    ArchiveVehicleExpenseUseCase,
    UnarchiveVehicleExpenseUseCase,
  ],
})
export class VehicleExpenseModule {}
