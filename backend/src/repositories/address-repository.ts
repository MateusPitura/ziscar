import { Address } from "@prisma/client";

export interface CreateAddress { }

export interface UpdateAddress { }


export abstract class AddressRepository {
    abstract create(data: CreateAddress): Promise<Address>;
    abstract findById(id: string): Promise<Address | null>;
    abstract update(id: string, data: UpdateAddress): Promise<void>;
    abstract delete(id: string): Promise<void>
}