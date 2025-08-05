import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleService } from './vehicle.service';
import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';

@Module({
  controllers: [VehicleController],
  providers: [
    PrismaService,
    {
      provide: VehicleRepository,
      useClass: VehicleService,
    },
    VehicleService,
    // InsertVehicleUseCase,
    // SearchVehiclesUseCase,
    // InsertExpenseUseCase,
    // FetchBrandsUseCase,
    // MakeSaleUseCase,
    // UpdateVehicleUseCase,
    // ToggleArquiveVehicleUseCase,
  ],
  exports: [VehicleRepository, VehicleService],
})
export class VehicleModule {}
