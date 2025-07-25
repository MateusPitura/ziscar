import { Client } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export interface CreateClient { }

export interface UpdateClient { }


export abstract class ClientRepository {
    abstract create(data: CreateInput<Client>): Promise<Client>;
    abstract findById(id: string): Promise<Client | null>;
    abstract update(id: string, data: UpdateInput<Client>): Promise<void>;
    abstract delete(id: string): Promise<void>
}