import { Store } from '@prisma/client';
import { CreateInput, FindOneInput, UpdateInput } from 'src/entities/store/store.type';

export abstract class StoreRepository {
  abstract create(_: CreateInput): Promise<{ storeId: number }>;
  abstract findOne(_: FindOneInput): Promise<Store | null>;
  abstract update(_: UpdateInput): Promise<Store | null>;
}
