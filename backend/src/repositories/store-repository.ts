import { Store } from "@prisma/client";

export interface CreateStore { }

export interface UpdateStore { }


export abstract class StoreRepository {
    abstract create(data: CreateStore): Promise<Store>;
    abstract findById(id: string): Promise<Store | null>;
    abstract update(id: string, data: UpdateStore): Promise<void>;
    abstract delete(id: string): Promise<void>
}