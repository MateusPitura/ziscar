import { City } from '@prisma/client';
export abstract class CityRepository {
  abstract getAllByState(abbreviation: string): Promise<City[]>;
}
