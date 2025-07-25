import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleBrandRepository } from 'src/repositories/vehicle_brand-repository';
import { VehicleBrandService } from './vehicle-brand.service';
import { Module } from '@nestjs/common';
import { VehicleBrandController } from './vehicle-brand.controller';

@Module({
  controllers: [VehicleBrandController],
  providers: [PrismaService,
    {
      provide: VehicleBrandRepository,
      useClass: VehicleBrandService,
    },
    VehicleBrandService,],
  exports: [VehicleBrandRepository, VehicleBrandService],
})
export class VehicleBrandModule {}
