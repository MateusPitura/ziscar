import { Module } from '@nestjs/common';
import { VehicleBrandController } from './vehicle-brand.controller';

@Module({
  controllers: [VehicleBrandController],
  providers: [],
})
export class VehicleBrandModule {}
