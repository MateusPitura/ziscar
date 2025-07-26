import { Customer } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

export abstract class CustomerRepository {
  abstract create(data: CreateInput<Customer>): Promise<Customer>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract update(id: string, data: UpdateInput<Customer>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
