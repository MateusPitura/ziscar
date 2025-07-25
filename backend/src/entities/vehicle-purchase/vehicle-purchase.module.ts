import { Module } from '@nestjs/common';
import { VehiclePurchaseController } from './vehicle-purchase.controller';

@Module({
  controllers: [VehiclePurchaseController],
  providers: [],
})
export class VehiclePurchaseModule {}
