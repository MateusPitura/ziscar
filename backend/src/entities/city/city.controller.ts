import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './city.service';
import { BrazilianState } from '@prisma/client';

@Controller('city')
export class CityController {
    constructor(private readonly cityService: CityService) { }

    @Get('/:state')
    async getAllByState(@Param('state') state: BrazilianState) {
        return this.cityService.getAllByState(state);
    }
}
