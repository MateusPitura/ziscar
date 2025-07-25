import { Module } from '@nestjs/common';
import { VehicleSaleController } from './vehicle-sale.controller';

@Module({
  controllers: [VehicleSaleController],
  providers: [],
})
export class VehicleSaleModule {}
