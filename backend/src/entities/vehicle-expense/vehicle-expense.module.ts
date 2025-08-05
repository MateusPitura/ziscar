import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleExpenseRepository } from 'src/repositories/vehicle_expense-repository';
import { VehicleExpenseService } from './vehicle-expense.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    PrismaService,
    {
      provide: VehicleExpenseRepository,
      useClass: VehicleExpenseService,
    },
    VehicleExpenseService,
  ],
  exports: [VehicleExpenseRepository, VehicleExpenseService],
})
export class VehicleExpenseModule {}
