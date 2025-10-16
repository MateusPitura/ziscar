import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { AccountPayableInstallmentModule } from '../account-payable-installment/account-payable-installment.module';
import { AccountPayableModule } from '../account-payable/account-payable.module';
import { AccountReceivableInstallmentModule } from '../account-receivable-installment/account-receivable-installment.module';
import { AccountReceivableModule } from '../account-receivable/account-receivable.module';
import { CustomerModule } from '../customer/customer.module';
import { PaymentMethodPayableModule } from '../payment-method-payable/payment-method-payable.module';
import { PaymentMethodReceivableModule } from '../payment-method-receivable/payment-method-receivable.module';
import { UserModule } from '../user/user.module';
import { ArchiveVehicleUseCase } from './use-case/archive-vehicle.use-case';
import { FetchBrandsUseCase } from './use-case/fetch-brands.use-case';
import { GetVehicleByIdUseCase } from './use-case/get-vehicle-by-id.use-case';
import { GetVehicleSaleUseCase } from './use-case/get-vehicle-sale.use-case';
import { InsertVehicleUseCase } from './use-case/insert-vehicle.use-case';
import { MakeSaleUseCase } from './use-case/make-sale.use-case';
import { SearchModelUseCase } from './use-case/search-model.use-case';
import { SearchPaidToUseCase } from './use-case/search-paid-to.use-case';
import { SearchVehiclesUseCase } from './use-case/search-vehicles.use-case';
import { UnarchiveVehicleUseCase } from './use-case/unarchive-vehicle.use-case';
import { UpdateVehicleUseCase } from './use-case/update-vehicle.use-case';
import { ValidateVehicleUniqueFieldsUseCase } from './use-case/validate-vehicle-unique-fields.use-case';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

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
    SearchPaidToUseCase,
    SearchModelUseCase,
    FetchBrandsUseCase,
    MakeSaleUseCase,
    UpdateVehicleUseCase,
    ArchiveVehicleUseCase,
    UnarchiveVehicleUseCase,
    GetVehicleSaleUseCase,
    GetVehicleByIdUseCase,
    ValidateVehicleUniqueFieldsUseCase,
  ],
  exports: [
    VehicleRepository,
    VehicleService,
    InsertVehicleUseCase,
    SearchVehiclesUseCase,
    SearchPaidToUseCase,
    SearchModelUseCase,
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
