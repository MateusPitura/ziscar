import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleService } from './vehicle.service';
import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { InsertVehicleUseCase } from './use-case/insert-vehicle.use-case';
import { SearchVehiclesUseCase } from './use-case/search-vehicles.use-case';
import { FetchBrandsUseCase } from './use-case/fetch-brands.use-case';
import { MakeSaleUseCase } from './use-case/make-sale.use-case';
import { UpdateVehicleUseCase } from './use-case/update-vehicle.use-case';
import { ArchiveVehicleUseCase } from './use-case/archive-vehicle.use-case';
import { UnarchiveVehicleUseCase } from './use-case/unarchive-vehicle.use-case';
import { GetVehicleSaleUseCase } from './use-case/get-vehicle-sale.use-case';
import { GetVehicleByIdUseCase } from './use-case/get-vehicle-by-id.use-case';
import { UserModule } from '../user/user.module';
import { AccountPayableModule } from '../account-payable/account-payable.module';
import { AccountPayableInstallmentModule } from '../account-payable-installment/account-payable-installment.module';
import { PaymentMethodPayableModule } from '../payment-method-payable/payment-method-payable.module';
import { AccountReceivableModule } from '../account-receivable/account-receivable.module';
import { AccountReceivableInstallmentModule } from '../account-receivable-installment/account-receivable-installment.module';
import { PaymentMethodReceivableModule } from '../payment-method-receivable/payment-method-receivable.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    UserModule,
    AccountPayableModule,
    AccountPayableInstallmentModule,
    PaymentMethodPayableModule,
    AccountReceivableModule,
    AccountReceivableInstallmentModule,
    PaymentMethodReceivableModule,
    CustomerModule,
  ],
  controllers: [VehicleController],
  providers: [
    PrismaService,
    {
      provide: VehicleRepository,
      useClass: VehicleService,
    },
    VehicleService,
    InsertVehicleUseCase,
    SearchVehiclesUseCase,
    FetchBrandsUseCase,
    MakeSaleUseCase,
    UpdateVehicleUseCase,
    ArchiveVehicleUseCase,
    UnarchiveVehicleUseCase,
    GetVehicleSaleUseCase,
    GetVehicleByIdUseCase,
  ],
  exports: [
    VehicleRepository,
    VehicleService,
    InsertVehicleUseCase,
    SearchVehiclesUseCase,
    FetchBrandsUseCase,
    MakeSaleUseCase,
    UpdateVehicleUseCase,
    ArchiveVehicleUseCase,
    UnarchiveVehicleUseCase,
    GetVehicleSaleUseCase,
    GetVehicleByIdUseCase,
  ],
})
export class VehicleModule {}
