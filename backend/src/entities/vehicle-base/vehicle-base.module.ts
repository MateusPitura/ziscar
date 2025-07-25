import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleBaseRepository } from 'src/repositories/vehicle_base-repository';
import { VehicleBaseService } from './vehicle-base.service';
import { Module } from '@nestjs/common';
import { VehicleBaseController } from './vehicle-base.controller';

@Module({
  controllers: [VehicleBaseController],
  providers: [PrismaService,
    {
      provide: VehicleBaseRepository,
      useClass: VehicleBaseService,
    },
    VehicleBaseService,],
  exports: [VehicleBaseRepository, VehicleBaseService],
})
export class VehicleBaseModule {}
