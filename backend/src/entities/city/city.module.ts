import { Module } from '@nestjs/common';
import { CityController } from './city.controller';

@Module({
  controllers: [CityController],
  providers: [],
})
export class CityModule {}
