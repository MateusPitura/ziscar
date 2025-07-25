import { Module } from '@nestjs/common';
import { VehicleCharacteristicValueController } from './vehicle-characteristic-value.controller';

@Module({
  controllers: [VehicleCharacteristicValueController],
  providers: [],
})
export class VehicleCharacteristicValueModule {}
