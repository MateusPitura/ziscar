import { Store } from '@prisma/client';
import { CreateInput, FindOneInput } from 'src/entities/store/store.type';
import { UpdateInput } from 'src/types';

export abstract class StoreRepository {
  abstract create(_: CreateInput): Promise<{ storeId: number }>;
  abstract findOne(_: FindOneInput): Promise<Store | null>;
  abstract update(id: string, data: UpdateInput<Store>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
