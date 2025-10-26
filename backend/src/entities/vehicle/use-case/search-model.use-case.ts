import { Injectable } from '@nestjs/common';
import { SearchModelRequestDto, SearchModelResponseDto } from '../dtos';
import { VehicleService } from '../vehicle.service';

@Injectable()
export class SearchModelUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  execute(
    input: SearchModelRequestDto,
    enterpriseId: number,
  ): Promise<SearchModelResponseDto> {
    return this.vehicleService.searchModel(input, enterpriseId);
  }
}
