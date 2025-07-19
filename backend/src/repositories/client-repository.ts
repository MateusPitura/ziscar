import { Client } from "@prisma/client";

export interface CreateClient { }

export interface UpdateClient { }


export abstract class ClientRepository {
    abstract create(data: CreateClient): Promise<Client>;
    abstract findById(id: string): Promise<Client | null>;
    abstract update(id: string, data: UpdateClient): Promise<void>;
    abstract delete(id: string): Promise<void>
}