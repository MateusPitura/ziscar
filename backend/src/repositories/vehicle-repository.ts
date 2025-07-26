import { Vehicle } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

export abstract class VehicleRepository {
  abstract create(data: CreateInput<Vehicle>): Promise<Vehicle>;
  abstract findById(id: string): Promise<Vehicle | null>;
  abstract update(id: string, data: UpdateInput<Vehicle>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
