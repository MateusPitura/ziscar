import { Module } from '@nestjs/common';
import { VehicleExpenseController } from './vehicle-expense.controller';

@Module({
  controllers: [VehicleExpenseController],
  providers: [],
})
export class VehicleExpenseModule {}
