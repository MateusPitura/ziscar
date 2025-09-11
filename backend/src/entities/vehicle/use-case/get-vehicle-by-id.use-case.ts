import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleCategory, VehicleStatus, FuelType } from '@shared/enums';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleWithPaymentResponseDto } from '../dtos';

@Injectable()
export class GetVehicleByIdUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(vehicleId: string): Promise<VehicleWithPaymentResponseDto> {
    const vehicleResult =
      await this.vehicleRepository.getVehicleWithPayment(vehicleId);

    if (!vehicleResult) throw new NotFoundException('Vehicle not found');

    const { vehiclePurchases, ...vehicle } = vehicleResult;

    const payment = vehiclePurchases?.[0]
      ? {
          purchaseDate: vehiclePurchases[0].date,
          paidTo: vehiclePurchases[0].accountPayable?.paidTo || null,
          value:
            vehiclePurchases[0].accountPayable?.accountPayableInstallments.reduce(
              (total, installment) => total + installment.value,
              0,
            ) || 0,
        }
      : undefined;

    return {
      ...vehicle,
      category: vehicle.category as VehicleCategory,
      status: vehicle.status as VehicleStatus,
      fuelType: vehicle.fuelType as FuelType | null,
      payment,
    };
  }
}
