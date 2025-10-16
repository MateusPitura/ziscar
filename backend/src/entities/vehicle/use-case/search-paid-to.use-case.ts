import { Injectable } from '@nestjs/common';
import { SearchPaidToRequestDto, SearchPaidToResponseDto } from '../dtos';
import { VehicleService } from '../vehicle.service';

@Injectable()
export class SearchPaidToUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  execute(input: SearchPaidToRequestDto): Promise<SearchPaidToResponseDto> {
    return this.vehicleService.searchPaidTo(input);
  }
}
