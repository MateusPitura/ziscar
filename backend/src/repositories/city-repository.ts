import { BrazilianState, City } from '@prisma/client';
export abstract class CityRepository {
  abstract getAllByState(state: BrazilianState): Promise<City[]>;
}
