import { Module } from '@nestjs/common';
import { VehicleBaseController } from './vehicle-base.controller';

@Module({
  controllers: [VehicleBaseController],
  providers: [],
})
export class VehicleBaseModule {}
