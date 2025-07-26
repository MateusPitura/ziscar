import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleSaleRepository } from 'src/repositories/vehicle_sale-repository';
import { VehicleSaleService } from './vehicle-sale.service';
import { Module } from '@nestjs/common';
import { VehicleSaleController } from './vehicle-sale.controller';

@Module({
  controllers: [VehicleSaleController],
  providers: [
    PrismaService,
    {
      provide: VehicleSaleRepository,
      useClass: VehicleSaleService,
    },
    VehicleSaleService,
  ],
  exports: [VehicleSaleRepository, VehicleSaleService],
})
export class VehicleSaleModule {}
