import { AccountPayable } from "@prisma/client";

export interface CreateAccountPayable { }

export interface UpdateAccountPayable { }


export abstract class AccountPayableRepository {
    abstract create(data: CreateAccountPayable): Promise<AccountPayable>;
    abstract findById(id: string): Promise<AccountPayable | null>;
    abstract update(id: string, data: UpdateAccountPayable): Promise<void>;
    abstract delete(id: string): Promise<void>
}