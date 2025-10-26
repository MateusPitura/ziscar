import { Injectable } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import { SearchVehiclesRequestDto, SearchVehiclesResponseDto } from '../dtos';

@Injectable()
export class SearchVehiclesUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  execute(
    input: SearchVehiclesRequestDto,
    enterpriseId: number,
  ): Promise<SearchVehiclesResponseDto> {
    return this.vehicleService.search(input, enterpriseId);
  }
}
