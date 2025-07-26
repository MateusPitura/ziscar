import { City } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';
export abstract class CityRepository {
  abstract create(data: CreateInput<City>): Promise<City>;
  abstract findById(ibgeCode: string): Promise<City | null>;
  abstract update(ibgeCode: string, data: UpdateInput<City>): Promise<void>;
  abstract delete(ibgeCode: string): Promise<void>;
}
