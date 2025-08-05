import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VehicleBaseService } from './vehicle-base.service';
import { CreateVehicleBaseDTO } from 'src/infra/dtos/vehicle-base/create-vehicle-base.dto';
import { UpdateVehicleBaseDTO } from 'src/infra/dtos/vehicle-base/update-vehicle-base.dto';

@Controller('vehicle-base')
export class VehicleBaseController {
  constructor(private readonly vehicleBaseService: VehicleBaseService) {}

  @Post('/')
  async createVehicleBase(@Body() body: CreateVehicleBaseDTO) {
    const vehicleBase = await this.vehicleBaseService.create(body);
    return vehicleBase;
  }

  @Get('/:id')
  async getVehicleBaseById(@Param('id') id: string) {
    const vehicleBase = await this.vehicleBaseService.findById(id);
    if (!vehicleBase) {
      throw new Error('Vehicle base not found');
    }
    return vehicleBase;
  }

  @Put('/:id')
  async updateVehicleBase(
    @Param('id') id: string,
    @Body() body: UpdateVehicleBaseDTO,
  ) {
    await this.vehicleBaseService.update(id, body);
    return { message: 'Vehicle base updated successfully' };
  }

  @Delete('/:id')
  async deleteVehicleBase(@Param('id') id: string) {
    await this.vehicleBaseService.delete(id);
    return { message: 'Vehicle base deleted successfully' };
  }
}
