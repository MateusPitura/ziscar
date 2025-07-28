import { User } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

export abstract class UserRepository {
  abstract create(data: CreateInput<User>): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(id: string, data: UpdateInput<User>): Promise<void>;
  abstract archive(id: string): Promise<void>;
}
