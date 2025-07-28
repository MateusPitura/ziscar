import { PrismaService } from 'src/infra/database/prisma.service';
import { VehiclePurchaseRepository } from 'src/repositories/vehicle_purchase-repository';
import { VehiclePurchaseService } from './vehicle-purchase.service';
import { Module } from '@nestjs/common';
import { VehiclePurchaseController } from './vehicle-purchase.controller';

@Module({
  controllers: [VehiclePurchaseController],
  providers: [
    PrismaService,
    {
      provide: VehiclePurchaseRepository,
      useClass: VehiclePurchaseService,
    },
    VehiclePurchaseService,
  ],
  exports: [VehiclePurchaseRepository, VehiclePurchaseService],
})
export class VehiclePurchaseModule {}
