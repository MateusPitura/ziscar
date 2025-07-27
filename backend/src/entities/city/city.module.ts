import { PrismaService } from 'src/infra/database/prisma.service';
import { CityRepository } from 'src/repositories/city-repository';
import { CityService } from './city.service';
import { Module } from '@nestjs/common';
import { CityController } from './city.controller';

@Module({
  controllers: [CityController],
  providers: [
    PrismaService,
    {
      provide: CityRepository,
      useClass: CityService,
    },
    CityService,
  ],
  exports: [CityRepository, CityService],
})
export class CityModule {}
