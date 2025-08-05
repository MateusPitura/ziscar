import { Injectable } from '@nestjs/common';
import { BrazilianState, City } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CityRepository } from 'src/repositories/city-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class CityService implements CityRepository {
  constructor(private prisma: PrismaService) {}

  async getAllByState(abbreviation: BrazilianState): Promise<City[]> {
    return this.prisma.city.findMany({
      where: { state: abbreviation },
    });
  }

}
