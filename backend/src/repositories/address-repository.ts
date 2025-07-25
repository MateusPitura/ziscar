import { Address } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export interface CreateAddress { }

export interface UpdateAddress { }


export abstract class AddressRepository {
    abstract create(data: CreateInput<Address>): Promise<Address>;
    abstract findById(id: string): Promise<Address | null>;
    abstract update(id: string, data: UpdateInput<Address>): Promise<void>;
    abstract delete(id: string): Promise<void>
}