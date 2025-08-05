import { City } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';
export abstract class CityRepository {
  abstract getAllByState(abbreviation: string): Promise<City[]>;
}
