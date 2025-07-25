import { Store } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";




export abstract class StoreRepository {
    abstract create(data: CreateInput<Store>): Promise<Store>;
    abstract findById(id: string): Promise<Store | null>;
    abstract update(id: string, data: UpdateInput<Store>): Promise<void>;
    abstract delete(id: string): Promise<void>
}