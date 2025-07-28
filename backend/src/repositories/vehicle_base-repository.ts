import { VehicleBase } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

export abstract class VehicleBaseRepository {
  abstract create(data: CreateInput<VehicleBase>): Promise<VehicleBase>;
  abstract findById(id: string): Promise<VehicleBase | null>;
  abstract update(id: string, data: UpdateInput<VehicleBase>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
