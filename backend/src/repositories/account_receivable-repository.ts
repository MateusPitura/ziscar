import { AccountReceivable } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export interface CreateAccountReceivable { }

export interface UpdateAccountReceivable { }


export abstract class AccountReceivableRepository {
    abstract create(data: CreateInput<AccountReceivable>): Promise<AccountReceivable>;
    abstract findById(id: string): Promise<AccountReceivable | null>;
    abstract update(id: string, data: UpdateInput<AccountReceivable>): Promise<void>;
    abstract delete(id: string): Promise<void>
}