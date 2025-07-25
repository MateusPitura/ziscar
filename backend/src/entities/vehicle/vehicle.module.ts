import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';

@Module({
  controllers: [VehicleController],
  providers: [],
})
export class VehicleModule {}
