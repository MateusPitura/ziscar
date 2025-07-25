import { AccountPayable } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export interface CreateAccountPayable { }

export interface UpdateAccountPayable { }


export abstract class AccountPayableRepository {
    abstract create(data: CreateInput<AccountPayable>): Promise<AccountPayable>;
    abstract findById(id: string): Promise<AccountPayable | null>;
    abstract update(id: string, data: UpdateInput<AccountPayable>): Promise<void>;
    abstract delete(id: string): Promise<void>
}