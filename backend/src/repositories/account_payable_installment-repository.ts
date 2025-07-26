import { AccountPayableInstallment } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export abstract class AccountPayableInstallmentRepository {
    abstract create(data: CreateInput<AccountPayableInstallment>): Promise<AccountPayableInstallment>;
    abstract findById(id: string): Promise<AccountPayableInstallment | null>;
    abstract update(id: string, data: UpdateInput<AccountPayableInstallment>): Promise<void>;
    abstract delete(id: string): Promise<void>
}