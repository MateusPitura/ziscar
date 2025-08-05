import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleCharacteristicValueRepository } from 'src/repositories/vehicle_characteristic_value-repository';
import { VehicleCharacteristicValueService } from './vehicle-characteristic-value.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    PrismaService,
    {
      provide: VehicleCharacteristicValueRepository,
      useClass: VehicleCharacteristicValueService,
    },
    VehicleCharacteristicValueService,
  ],
  exports: [
    VehicleCharacteristicValueRepository,
    VehicleCharacteristicValueService,
  ],
})
export class VehicleCharacteristicValueModule {}
