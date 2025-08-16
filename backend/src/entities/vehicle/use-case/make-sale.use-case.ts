import { Injectable } from '@nestjs/common';
import { MakeVehicleSaleRequestDto, MakeVehicleSaleResponseDto } from '../dtos';

@Injectable()
export class MakeSaleUseCase {
  execute(
    input: MakeVehicleSaleRequestDto,
  ): Promise<MakeVehicleSaleResponseDto> {
    console.log('🚀 ~ MakeSaleUseCase ~ execute ~ input:', input);
    return Promise.reject(new Error('Not implemented'));
  }
}
