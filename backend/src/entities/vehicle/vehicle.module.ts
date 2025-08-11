import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleService } from './vehicle.service';
import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { InsertVehicleUseCase } from './use-case/insert-vehicle.use-case';
import { SearchVehiclesUseCase } from './use-case/search-vehicles.use-case';
import { InsertExpenseUseCase } from './use-case/insert-expense.use-case';
import { FetchBrandsUseCase } from './use-case/fetch-brands.use-case';
import { MakeSaleUseCase } from './use-case/make-sale.use-case';
import { UpdateVehicleUseCase } from './use-case/update-vehicle.use-case';
import { ToggleArchiveVehicleUseCase } from './use-case/toggle-archive-vehicle.use-case';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
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
    InsertExpenseUseCase,
    FetchBrandsUseCase,
    MakeSaleUseCase,
    UpdateVehicleUseCase,
    ToggleArchiveVehicleUseCase,
  ],
  exports: [
    VehicleRepository,
    VehicleService,
    InsertVehicleUseCase,
    SearchVehiclesUseCase,
    InsertExpenseUseCase,
    FetchBrandsUseCase,
    MakeSaleUseCase,
    UpdateVehicleUseCase,
    ToggleArchiveVehicleUseCase,
  ],
})
export class VehicleModule {}
