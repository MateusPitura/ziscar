import { AccountReceivable } from "@prisma/client";

export interface CreateAccountReceivable { }

export interface UpdateAccountReceivable { }


export abstract class AccountReceivableRepository {
    abstract create(data: CreateAccountReceivable): Promise<AccountReceivable>;
    abstract findById(id: string): Promise<AccountReceivable | null>;
    abstract update(id: string, data: UpdateAccountReceivable): Promise<void>;
    abstract delete(id: string): Promise<void>
}